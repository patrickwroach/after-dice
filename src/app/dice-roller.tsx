"use client";

import React, { useState, useEffect, useCallback } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, push } from "firebase/database";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Switch from "@mui/material/Switch";
import Modal from "@mui/material/Modal";
import RoomManager from "./RoomManager";
import DiceRollerArea from "./DiceRollerArea";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

export default function DiceRoller() {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [numDice, setNumDice] = useState(1);
  const [minSuccess, setMinSuccess] = useState(4);
  const [user, setUser] = useState<null | User>(null);
  const [userRooms, setUserRooms] = useState<string[]>([]);
  const [allRooms, setAllRooms] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalIsPrivate, setModalIsPrivate] = useState(false);
  const [skipLogin, setSkipLogin] = useState(false);

  interface Roll {
    user: string;
    rolls: { value: number; success: boolean }[];
    successCount: number;
    timestamp: number;
  }

  const [rolls, setRolls] = useState<Roll[]>([]);
  const [joined, setJoined] = useState(false);
  /* 
  const isLocalhost = window?.location?.hostname === "localhost";
  const databasePath = isLocalhost ? "local_rooms" : "rooms";
   */
  
  const databasePath = "rooms";
  const fetchUserRooms = useCallback((displayName: string) => {
    const roomsRef = ref(database, databasePath);
    onValue(roomsRef, (snapshot) => {
      const roomsData = snapshot.val();
      if (roomsData) {
        const userRooms = Object.keys(roomsData).filter((roomId) => {
          const room = roomsData[roomId];
          return (
            room.rolls &&
            Object.values(room.rolls).some((value) => {
              const roll = value as Roll;
              return roll.user === displayName;
            })
          );
        });
        setUserRooms(userRooms);
      }
    });
  }, [databasePath]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setUserName(user.displayName ?? user.email ?? "");
        if (user) {
          fetchUserRooms(user.displayName || "");
        }
      } else {
        setUser(null);
        setUserName("");
        setUserRooms([]);
      }
    });
    return () => unsubscribe();
  }, [fetchUserRooms, user]);

  useEffect(() => {
    if (joined) {
      const roomRef = ref(database, `${databasePath}/${roomId}`);
      onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        if (data && data.rolls) {
          setRolls(Object.values(data.rolls));
        }
      });
    }
  }, [databasePath, joined, roomId]);

  useEffect(() => {
    const roomsRef = ref(database, "rooms");
    onValue(roomsRef, (snapshot) => {
      const roomsData = snapshot.val();
      if (roomsData) {
        const currentTime = Date.now();
        const publicRooms = Object.keys(roomsData).filter((roomId) => {
          const room = roomsData[roomId];
          if (room.expirationTime && room.expirationTime <= currentTime) {
            const roomRef = ref(database, `${databasePath}/${roomId}`);
            set(roomRef, null);
            return false;
          }
          return !room.private;
        });
        setAllRooms(publicRooms);
      }
    });
  }, [databasePath]);
  
  const sanitizeData = (data: { [key: string]: string | number | boolean | null | undefined }) => {
      const sanitizedData: { [key: string]: string | number | boolean | null | undefined } = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const sanitizedKey = key.replace(/[.#$/[\]]/g, "_");
        sanitizedData[sanitizedKey] = data[key];
      }
    }
    return sanitizedData;
  };

  const createRoom = (isPrivateRoom = isPrivate, newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase()) => {
    setRoomId(newRoomId);
    const roomRef = ref(database, `${databasePath}/${newRoomId}`);
    const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
    const roomData = sanitizeData({ created: true, expirationTime, private: isPrivateRoom });
    set(roomRef, roomData);
    const userRoomsRef = ref(database, `users/${user?.uid}/${databasePath}/${newRoomId}`);
    set(userRoomsRef, { joined: true });
    setJoined(true);

    // Schedule room deletion if no rolls are made within 24 hours
    setTimeout(() => {
      onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        if (data && (!data.rolls || Object.keys(data.rolls).length === 0)) {
          set(roomRef, null);
        }
      });
    }, 24 * 60 * 60 * 1000);
  };

  const handleJoinRoom = () => {
    const roomRef = ref(database, `${databasePath}/${roomId}`);
    onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userRoomsRef = ref(database, `users/${user?.uid}/${databasePath}/${roomId}`);
        set(userRoomsRef, { joined: true });
        setJoined(true);
      } else {
        setShowModal(true);
      }
    }, { onlyOnce: true });
  };

  const handleCreateRoomFromModal = () => {
    setShowModal(false);
    createRoom(modalIsPrivate, roomId);
  };

  const leaveRoom = () => {
    setJoined(false);
    setRoomId("");
  };

  const rollDice = () => {
    const newRolls = [];
    let successCount = 0;
    for (let i = 0; i < numDice; i++) {
      const roll = Math.floor(Math.random() * 6) + 1;
      const success = roll >= minSuccess && roll <= 6;
      if (success) successCount++;
      newRolls.push({
        value: roll,
        success,
      });
    }
    const rollRef = push(ref(database, `rooms/${roomId}/rolls`));
    set(rollRef, {
      user: userName,
      rolls: newRolls,
      successCount,
      timestamp: Date.now(),
    });
  };

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSkipLogin = () => {
    setSkipLogin(true);
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          {!user && !skipLogin ? (
            <Card>
              <CardHeader title="Sign In or Sign Up" />
              <CardContent>
                <Box
                  component="form"
                  noValidate
                  autoComplete="off"
                  sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <Button
                    variant="contained"
                    onClick={handleGoogleSignIn}
                    fullWidth
                  >
                    Sign In with Google
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleSkipLogin}
                    fullWidth
                  >
                    Skip Login
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <>
              <Button
                variant="contained"
                onClick={handleSignOut}
                fullWidth
                sx={{ mb: 2 }}
              >
                Sign Out
              </Button>
              {!joined ? (
                <RoomManager
                  userName={userName}
                  setUserName={setUserName}
                  roomId={roomId}
                  setRoomId={setRoomId}
                  joinRoom={handleJoinRoom}
                  createRoom={createRoom}
                  isPrivate={isPrivate}
                  setIsPrivate={setIsPrivate}
                  userRooms={userRooms}
                  allRooms={allRooms}
                  setJoined={setJoined}
                />
              ) : (
                <DiceRollerArea
                  roomId={roomId}
                  numDice={numDice}
                  setNumDice={setNumDice}
                  minSuccess={minSuccess}
                  setMinSuccess={setMinSuccess}
                
          
                  rollDice={rollDice}
                  leaveRoom={leaveRoom}
                  rolls={rolls}
                />
              )}
            </>
          )}
        </Box>
      </Container>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <Typography id="modal-title" variant="h6" component="h2">
            Room Not Found
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            The room ID you entered does not exist. Would you like to create a new room?
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
            <Typography>Private Room</Typography>
            <Switch
              checked={modalIsPrivate}
              onChange={(e) => setModalIsPrivate(e.target.checked)}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="contained" onClick={handleCreateRoomFromModal}>
              Create Room
            </Button>
            <Button variant="outlined" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </ThemeProvider>
  );
}
