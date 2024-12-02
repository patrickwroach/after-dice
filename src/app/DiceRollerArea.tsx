import React, { useState } from "react";
import { getDatabase, push, ref, set } from "firebase/database";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from "@mui/material";
import CheckRollCard from "./CheckRollCard";
import RiskRollCard from "./RiskRollCard";
import StatButtons from "./StatButtons";

interface Roll {
  value: number;
  success: boolean;
}

export interface RollData {
  user: string;
  rolls: Roll[];
  successCount: number;
  timestamp: number;
  rollType: string;
}

interface DiceRollerAreaProps {
  roomId: string;
  database: ReturnType<typeof getDatabase>;
  userName: string;
  leaveRoom: () => void;
  rolls: RollData[];
  characterSheetOpen: boolean;
}

const DiceRollerArea: React.FC<DiceRollerAreaProps> = ({
  roomId,
  database,
  rolls,
  characterSheetOpen,
  userName,
}) => {
  const [numDice, setNumDice] = useState(1);
  const [minSuccess, setMinSuccess] = useState(4);

  const rollDice = (setDiceNum?: number) => {
    const newRolls = [];
    let successCount = 0;
    const numofRolls = setDiceNum || numDice;
    for (let i = 0; i < numofRolls; i++) {
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
      rollType: "standard",
      user: userName,
      rolls: newRolls,
      successCount,
      timestamp: Date.now(),
    });
  };

  const afterSheet = React.useMemo(() => {
    const sheet = localStorage.getItem("after-character-sheet");
    return sheet ? JSON.parse(sheet) : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterSheetOpen]);

  const riskRoll = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    const rollRef = push(ref(database, `rooms/${roomId}/rolls`));
    set(rollRef, {
      rollType: "risk",
      user: userName,
      rolls: [roll],
      successCount: roll > afterSheet.focus ? 1 : 0,
      timestamp: Date.now(),
    });
    return roll > afterSheet.focus;
  };

  return (
    <div>
      <h1 style={{textAlign:'center'}}> {roomId} </h1>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 2 }}>
        <StatButtons sheet={afterSheet} rollDice={rollDice} />
        <Box
          sx={{
            display: "flex",
            gap: '2%',
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            label="Number of Dice"
            type="number"
            InputProps={{ inputProps: { min: 1 } }}
            value={numDice}
            onChange={(e) => setNumDice(parseInt(e.target.value))}
            sx={{ flexBasis: "32%" }}
          />
          <TextField
            label="Min for Success"
            type="number"
            InputProps={{ inputProps: { min: 1, max: 6 } }}
            value={minSuccess}
            onChange={(e) => setMinSuccess(parseInt(e.target.value))}
            sx={{ flexBasis: "32%" }}
          />
          <Button
            variant="contained"
            onClick={() => rollDice()}
            sx={{ height: "100%", flexBasis: "32%"  }}
            disabled={numDice < 1}
          >
            Roll
          </Button>
        </Box>

        <Button
          variant="contained"
          onClick={() => riskRoll()}
          fullWidth
          sx={{ mt: -1 }}
          disabled={numDice < 1}
        >
          Risk Roll
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column-reverse",
          gap: 2,
        }}
      >
        {rolls.map((roll, index) =>
          roll.rollType === "standard" ? (
            <CheckRollCard key={index} roll={roll} index={index} />
          ) : (
            <RiskRollCard
              key={index}
              roll={roll}
              index={index}
              focus={afterSheet.focus}
            />
          )
        )}
      </Box>
    </div>
  );
};

export default DiceRollerArea;
