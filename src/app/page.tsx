'use client';

import styles from "./page.module.css";
import DiceRoller from "./DiceRoller";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { themeOptions } from "./theme";

const theme = createTheme(themeOptions);

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <div className={styles.page}>
        <DiceRoller/>
      </div>
    </ThemeProvider>
  );
}
