import React, { useEffect, useState, useMemo } from "react";
import { Box, TextField, Drawer } from "@mui/material";
const defaultSheet = {
  focus: 1,
  memories: 1,
  past: {
    body: 0,
    psyche: 0,
    wealth: 0,
    rep: 0,
  },
  present: {
    body: 0,
    psyche: 0,
    wealth: 0,
    rep: 0,
  },
};

export interface CharacterSheetInterface {
  focus: number;
  memories: number;
  past: {
    body: number;
    psyche: number;
    wealth: number;
    rep: number;
  };
  present: {
    body: number;
    psyche: number;
    wealth: number;
    rep: number;
  };
}

interface CharacterSheetProps {
  open: boolean;
  toggleCharacterSheet: (open: boolean) => void;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({
  open = false,
  toggleCharacterSheet,
}) => {
  const savedSheet = useMemo(() => {
    const fetchedSheet = localStorage.getItem("after-character-sheet");
    return typeof fetchedSheet === "string"
      ? JSON.parse(fetchedSheet)
      : defaultSheet;
  }, []);
  const [sheet, setSheet] = useState(savedSheet);
  const handleTopLevelSheetChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSheet({ ...sheet, [name]: Number(value) });
  };
  const handleStatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const protectedValue = Number(value) > -1 ? Number(value) : 0;
    if (name.includes("past-")) {
      setSheet({
        ...sheet,
        past: {
          ...sheet?.past,
          [name.replace("past-", "")]: protectedValue,
        },
        present: { ...sheet?.present },
      });
    } else {
      setSheet({
        ...sheet,
        past: {
          ...sheet?.past,
        },
        present: { ...sheet?.present, [name]: protectedValue },
      });
    }
  };

  useEffect(() => {
    const savedSheet = localStorage.getItem("after-character-sheet");
    if (savedSheet) {
      setSheet(JSON.parse(savedSheet));
    }
  }, []);

  useEffect(() => {
    const savedSheet = localStorage.getItem("after-character-sheet");
    console.log(savedSheet);
    console.log(JSON.stringify(sheet));
    if (savedSheet !== JSON.stringify(sheet)) {
      localStorage.setItem("after-character-sheet", JSON.stringify(sheet));
    }
  }, [sheet]);

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={() => toggleCharacterSheet(false)}
    >
      <Box sx={{ padding: "2%", width: "30vw", minWidth: "300px" }}>
        <Box
          sx={{ display: "flex", gap: "2%", flexWrap: "wrap", marginBlock: 2 }}
        >
          <TextField
            label="Focus"
            type="number"
            name="focus"
            value={sheet?.focus}
            onChange={handleTopLevelSheetChange}
            sx={{ flexBasis: "23%" }}
          />
          <TextField
            label="Memories"
            type="number"
            name="memories"
            value={sheet?.memories}
            onChange={handleTopLevelSheetChange}
            sx={{ flexBasis: "23%" }}
          />
        </Box>
        <h3>Present Stats</h3>
        <Box
          sx={{ display: "flex", gap: "2%", flexWrap: "wrap", marginBlock: 2 }}
        >
          <TextField
            label="Body"
            type="number"
            name="body"
            value={sheet?.present.body}
            onChange={handleStatChange}
            sx={{ flexBasis: "23%" }}
          />
          <TextField
            label="Psyche"
            type="number"
            name="psyche"
            value={sheet?.present.psyche}
            onChange={handleStatChange}
            sx={{ flexBasis: "23%" }}
          />
          <TextField
            label="Wealth"
            type="number"
            name="wealth"
            value={sheet?.present.wealth}
            onChange={handleStatChange}
            sx={{ flexBasis: "23%" }}
          />
          <TextField
            label="Rep"
            type="number"
            name="rep"
            value={sheet?.present.rep}
            onChange={handleStatChange}
            sx={{ flexBasis: "23%" }}
          />
        </Box>
        <h3>Past Stats</h3>
        <Box
          sx={{ display: "flex", gap: "2%", flexWrap: "wrap", marginBlock: 2 }}
        >
          <TextField
            label="Body"
            type="number"
            name="past-body"
            value={sheet?.past.body}
            onChange={handleStatChange}
            sx={{ flexBasis: "23%" }}
          />
          <TextField
            label="Psyche"
            type="number"
            name="past-psyche"
            value={sheet?.past.psyche}
            onChange={handleStatChange}
            sx={{ flexBasis: "23%" }}
          />
          <TextField
            label="Wealth"
            type="number"
            name="past-wealth"
            value={sheet?.past.wealth}
            onChange={handleStatChange}
            sx={{ flexBasis: "23%" }}
          />
          <TextField
            label="Rep"
            type="number"
            name="past-rep"
            value={sheet?.past.rep}
            onChange={handleStatChange}
            sx={{ flexBasis: "23%" }}
          />
        </Box>
      </Box>
    </Drawer>
  );
};

export default CharacterSheet;
