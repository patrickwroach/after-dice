import { useState } from "react";
import { Box, Button, Tabs, Tab, Typography } from "@mui/material";

import { CharacterSheetInterface } from "./CharacterSheet";

interface StatButtonsProps {
  sheet: CharacterSheetInterface;
  rollDice: (value: number) => void;
}

interface TabPanelProps {
  index: number;
  value: number;
  type: "present" | "past";
  rollDice: (value: number) => void;
  sheet: CharacterSheetInterface;
}
const StatPanel: React.FC<TabPanelProps> = ({
  value,
  index,
  type,
  sheet,
  rollDice,
}) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
  >
    {value === index && (
      <Box
        sx={{
          gap: 1,
          display: "flex",
          maxWidth: "100%",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {Object.entries(sheet[type]).map(
          ([key, value]) =>
            (value as number) > 0 && (
              <Button
                size="small"
                key={key}
                variant="contained"
                onClick={() => {
                  rollDice(value as number);
                }}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <Typography variant="button">{value}</Typography>
                <Typography variant="caption"> {key}</Typography>
              </Button>
            )
        )}
      </Box>
    )}
  </div>
);
const StatButtons: React.FC<StatButtonsProps> = ({ sheet, rollDice }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Tabs
        value={value}
        onChange={handleChange}
        sx={{
          marginBlockEnd: 1,
          ".MuiTabs-flexContainer": {
            justifyContent: "center",
          },
        }}
      >
        {Object.values(sheet.present).some((x) => x > 0) && (
          <Tab label="Present" />
        )}
        {Object.values(sheet.past).some((x) => x > 0) && <Tab label="Past" />}
      </Tabs>
      {Object.values(sheet.present).some((x) => x > 0) && (
        <StatPanel
          value={value}
          index={0}
          type="present"
          rollDice={rollDice}
          sheet={sheet}
        />
      )}
      {Object.values(sheet.past).some((x) => x > 0) && (
        <StatPanel
          value={value}
          index={1}
          type="past"
          rollDice={rollDice}
          sheet={sheet}
        />
      )}
    </Box>
  );
};

export default StatButtons;
