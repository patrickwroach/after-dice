import styles from "./page.module.css";
import DiceRoller from "./DiceRoller";

export default function Home() {
  return (
    <div className={styles.page}>
      <DiceRoller/>
    </div>
  );
}
