import Image from "next/image";
import styles from "./page.module.css";
import DiceRoller from "./dice-roller";

export default function Home() {
  return (
    <div className={styles.page}>
      <DiceRoller/>
    </div>
  );
}
