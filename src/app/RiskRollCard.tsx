import { Card, CardContent, Typography, Chip } from "@mui/material";
import { RollData } from "./DiceRollerArea";

const RiskRollCard = ({ roll, index , focus}: { roll: RollData; index: number, focus: number }) => (
  <Card key={index} variant="outlined">
    <CardContent>
      <Typography variant="subtitle1" gutterBottom>
        <div>
          <strong>{roll.user}</strong> made a Risk Roll against a focus of {focus}
        </div>
      </Typography>
    <Typography variant="body2" gutterBottom>
        {roll.successCount === 1 ? "Success" : "Failure"}
    </Typography>
      <Chip
        label={roll.rolls[0].toString()}
        color={roll.successCount === 1 ? "success" : "error"}
      />
    </CardContent>
  </Card>
);
export default RiskRollCard;
