/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import styles from "../styles";

const ActionButton = ({ img, clickHandler, restStyles }) => {
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      className={`${styles.gameMoveBox} ${styles.flexCenter} ${styles.glassEffect} ${restStyles}`}
      onClick={clickHandler}
    >
      <img src={img} alt="action" className={styles.gameMoveIcon} />
    </div>
  );
};

export default ActionButton;
