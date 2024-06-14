/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import ReactParallaxTilt from "react-parallax-tilt";
import styles from "../styles";
import { allCards } from "../assets";

const generateRandomCardImg = () =>
  allCards[Math.floor(Math.random() * allCards.length - 1)];

const image1 = generateRandomCardImg();
const image2 = generateRandomCardImg();

const Card = ({ card, title, cardRef, playerTwo, restStyles }) => {
  return (
    <div className={`${styles.cardContainer} ${restStyles}`}>
      <img
        src={playerTwo ? image2 : image1}
        alt="card"
        className={styles.cardImg}
      />
    </div>
  );
};

export default Card;
