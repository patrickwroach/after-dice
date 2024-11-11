'use client'

import React, { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, onValue, push } from 'firebase/database'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

export default function DiceRoller() {
  const [roomId, setRoomId] = useState('')
  const [userName, setUserName] = useState('')
  const [numDice, setNumDice] = useState(1)
  const [minSuccess, setMinSuccess] = useState(4)
  const [maxSuccess, setMaxSuccess] = useState(6)
  interface Roll {
    user: string;
    rolls: { value: number; success: boolean }[];
    timestamp: number;
  }

  const [rolls, setRolls] = useState<Roll[]>([])
  const [joined, setJoined] = useState(false)

  useEffect(() => {
    if (joined) {
      const roomRef = ref(database, `rooms/${roomId}`)
      onValue(roomRef, (snapshot) => {
        const data = snapshot.val()
        if (data && data.rolls) {
          setRolls(Object.values(data.rolls))
        }
      })
    }
  }, [joined, roomId])

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase()
    setRoomId(newRoomId)
    set(ref(database, `rooms/${newRoomId}`), { created: true })
    setJoined(true)
  }

  const joinRoom = () => {
    if (roomId) {
      setJoined(true)
    }
  }

  const rollDice = () => {
    const newRolls = []
    for (let i = 0; i < numDice; i++) {
      const roll = Math.floor(Math.random() * 6) + 1
      newRolls.push({
        value: roll,
        success: roll >= minSuccess && roll <= maxSuccess
      })
    }
    const rollRef = push(ref(database, `rooms/${roomId}/rolls`))
    set(rollRef, {
      user: userName,
      rolls: newRolls,
      timestamp: Date.now()
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          {!joined ? (
            <Card>
              <CardHeader title="Join or Create a Room" />
              <CardContent>
                <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" onClick={joinRoom} disabled={!roomId || !userName}>
                      Join Room
                    </Button>
                    <Button variant="outlined" onClick={createRoom} disabled={!userName}>
                      Create Room
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader title={`Dice Roller - Room: ${roomId}`} />
              <CardContent>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={4}>
                    <TextField
                      label="Number of Dice"
                      type="number"
                      InputProps={{ inputProps: { min: 1 } }}
                      value={numDice}
                      onChange={(e) => setNumDice(parseInt(e.target.value))}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Min Success"
                      type="number"
                      InputProps={{ inputProps: { min: 1, max: 6 } }}
                      value={minSuccess}
                      onChange={(e) => setMinSuccess(parseInt(e.target.value))}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Max Success"
                      type="number"
                      InputProps={{ inputProps: { min: 1, max: 6 } }}
                      value={maxSuccess}
                      onChange={(e) => setMaxSuccess(parseInt(e.target.value))}
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Button variant="contained" onClick={rollDice} fullWidth sx={{ mb: 2 }}>
                  Roll Dice
                </Button>
                <Typography variant="h6" gutterBottom>
                  Roll Results:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column-reverse',  flexWrap: 'wrape', gap: 2 }}>
                  {rolls.map((roll, index) => (
                    <Card key={index} variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          <div><strong>{roll.user}</strong> rolled:</div>
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {roll.rolls.map((die, dieIndex) => (
                            <Chip
                              key={dieIndex}
                              label={die.value}
                              color={die.success ? 'success' : 'error'}
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  )
}