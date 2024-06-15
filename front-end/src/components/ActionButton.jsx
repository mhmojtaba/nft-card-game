/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import styles from "../styles";

const ActionButton = ({ img, clickHandler, restStyles }) => {
  return (
    <div
      className={`${styles.gameMoveBox} ${styles.flexCenter} ${styles.glassEffect} ${restStyles}`}
    >
      <img src={img} alt="action" className={styles.gameMoveIcon} />
    </div>
  );
};

export default ActionButton;
