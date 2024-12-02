import React from "react";
import CharacterSheet from "./CharacterSheet";
import { Grid2, Button, Card, CardContent, CardHeader, Switch, TextField, Typography } from "@mui/material";

interface RoomManagerProps {
  userName: string;
  setUserName: (name: string) => void;
  roomId: string;
  setRoomId: (id: string) => void;
  joinRoom: () => void;
  createRoom: () => void;
  isPrivate: boolean;
  setIsPrivate: (isPrivate: boolean) => void;
  userRooms: string[];
  allRooms: string[];
  setJoined: (joined: boolean) => void;
}

const RoomManager: React.FC<RoomManagerProps> = ({
  userName,
  setUserName,
  roomId,
  setRoomId,
  joinRoom,
  createRoom,
  isPrivate,
  setIsPrivate,
  userRooms,
  allRooms,
  setJoined,
}) => {
  return (
    <>
    <Card>
      <CardHeader title="Join or Create a Room" />
      <CardContent>
        <Grid2
          component="form"
          noValidate
          autoComplete="off"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            fullWidth
          />
          <Grid2 sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={joinRoom}
              disabled={!roomId || !userName}
            >
              Join Room
            </Button>
            <Button
              onClick={createRoom}
              disabled={!userName}
            >
              Create Room
            </Button>
          </Grid2>
          <Grid2 sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography>Private Room</Typography>
            <Switch
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
          </Grid2>
          {userRooms.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Your Rooms:
              </Typography>
              <Grid2
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {userRooms.map((room, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    onClick={() => {
                      setRoomId(room);
                      setJoined(true);
                    }}
                  >
                    {room}
                  </Button>
                ))}
              </Grid2>
            </>
          )}
          <Typography variant="h6" gutterBottom>
            All Rooms:
          </Typography>
          <Grid2
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {allRooms.map((room, index) => (
              <Button
                key={index}
                variant="outlined"
                onClick={() => {
                  setRoomId(room);
                  setJoined(true);
                }}
              >
                {room}
              </Button>
            ))}
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
    </>
  );
};

export default RoomManager;