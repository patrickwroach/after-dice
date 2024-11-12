import React, { useState } from "react";
import { Box, Button, Card, CardContent, CardHeader, Chip, TextField, Typography } from "@mui/material";

interface Roll {
  value: number;
  success: boolean;
}

interface RollData {
  user: string;
  rolls: Roll[];
  successCount: number;
  timestamp: number;
}

interface DiceRollerAreaProps {
  roomId: string;
  numDice: number;
  setNumDice: (num: number) => void;
  minSuccess: number;
  setMinSuccess: (num: number) => void;
  rollDice: () => void;
  leaveRoom: () => void;
  rolls: RollData[];
}

const DiceRollerArea: React.FC<DiceRollerAreaProps> = ({
  roomId,
  numDice,
  setNumDice,
  minSuccess,
  setMinSuccess,
  rollDice,
  leaveRoom,
  rolls,
}) => {
  const [showAllChips, setShowAllChips] = useState<{ [key: number]: boolean }>({});

  const toggleShowAllChips = (index: number) => {
    setShowAllChips((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <Card>
      <CardHeader title={`Dice Roller - Room: ${roomId}`} />
      <CardContent>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", marginBlockEnd:2 }}>
    
            <TextField
              label="Number of Dice"
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
              value={numDice}
              onChange={(e) => setNumDice(parseInt(e.target.value))}
              sx={{flexBasis: "30%"}}
           
            />
            <TextField
              label="Minimum for Success"
              type="number"
              InputProps={{ inputProps: { min: 1, max: 6 } }}
              value={minSuccess}
              onChange={(e) => setMinSuccess(parseInt(e.target.value))}
              sx={{flexBasis: "30%"}}
            />
        </Box>
        <Button
          variant="contained"
          onClick={rollDice}
          fullWidth
          sx={{ mb: 2 }}
          disabled={numDice < 1}
        >
          Roll Dice
        </Button>
        <Button
          variant="contained"
          onClick={leaveRoom}
          fullWidth
          sx={{ mb: 2 }}
        >
          Leave Room
        </Button>
        <Typography variant="h6" gutterBottom>
          Roll Results:
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column-reverse",
            gap: 2,
          }}
        >
          {rolls.map((roll, index) => (
            <Card key={index} variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  <div>
                    <strong>{roll.user}</strong> rolled:
                  </div>
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Total Successes: {roll.successCount}
                </Typography>
                <Box
                  sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                >
                  {roll.rolls.slice(0, showAllChips[index] ? roll.rolls.length : 20).map((die, dieIndex) => (
                    <Chip
                      key={dieIndex}
                      label={die.value}
                      color={die.success ? "success" : "error"}
                    />
                  ))}
                </Box>
                {roll.rolls.length > 20 && (
                  <Button
                    variant="text"
                    onClick={() => toggleShowAllChips(index)}
                  >
                    {showAllChips[index] ? "Show Less" : "Show All"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DiceRollerArea;