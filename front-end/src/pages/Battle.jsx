/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from "react-router-dom";
import styles from "../styles";
import { useGlobalContext } from "../context";
import {
  attack,
  attackSound,
  defense,
  defenseSound,
  player01,
  player02,
} from "../assets";
import { playAudio } from "../utils/animation";
import { useState } from "react";

const Battle = () => {
  const { contract, gameData, walletAddress } = useGlobalContext();
  const [player1, setPlayer1] = useState({});
  const [player2, setPlayer2] = useState({});
  const { battleName } = useParams();

  return (
    <div className={`${styles.flexBetween} ${styles.gameContainer} astral`}>
      battle
    </div>
  );
};

export default Battle;
