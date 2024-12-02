import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
} from "@mui/material";
import { RollData } from "./DiceRollerArea";


const CheckRollCard = ({ roll, index }: { roll: RollData; index: number }) => {
    const [showAllChips, setShowAllChips] = useState<boolean>(false); 
    return (
    <Card key={index} variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          <div>
            <strong>{roll.user}</strong> rolled {roll.rolls.length} dice
          </div>
        </Typography>
        <Typography variant="body2" gutterBottom>
          Total Successes: {roll.successCount}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {roll.rolls
            .slice(0, showAllChips ? roll.rolls.length : 20)
            .map((die, dieIndex) => (
              <Chip
                key={dieIndex}
                label={die.value}
                color={die.success ? "success" : "error"}
              />
            ))}
        </Box>
        {roll.rolls.length > 20 && (
          <Button variant="text" onClick={() => setShowAllChips(prev=>!prev)}>
            {showAllChips ? "Show Less" : "Show All"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
export default CheckRollCard;
