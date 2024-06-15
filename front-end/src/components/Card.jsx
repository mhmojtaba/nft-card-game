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
    <ReactParallaxTilt>
      <div className={`${styles.cardContainer} ${restStyles}`}>
        <img
          src={playerTwo ? image2 : image1}
          alt="card"
          className={styles.cardImg}
        />
        <div
          className={`${styles.cardPointContainer} sm:left-[21%] left-[22%] ${styles.flexCenter}`}
        >
          <p className={`${styles.cardPoint} text-yellow-400`}>
            {card?.attack || 10}
          </p>
        </div>
        <div
          className={`${styles.cardPointContainer} sm:right-[14%] right-[22%] ${styles.flexCenter}`}
        >
          <p className={`${styles.cardPoint} text-red-700`}>
            {card?.defense || 5}
          </p>
        </div>
        <div className={`${styles.cardTextContainer} ${styles.flexCenter}`}>
          <p className={styles.cardText}>{title || "player"}</p>
        </div>
      </div>
    </ReactParallaxTilt>
  );
};

export default Card;
