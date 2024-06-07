import styles from "../styles";

/* eslint-disable react/prop-types */
const CustomButton = ({ title, clickHandler, restStyles }) => {
  return (
    <>
      <button onClick={clickHandler} className={`${styles.btn} ${restStyles}`}>
        {title}
      </button>
    </>
  );
};

export default CustomButton;
