/* eslint-disable react/prop-types */
import styles from "../styles";

const regex = /^[a-zA-Z0-9]+$/;

const CustomInput = ({ placeholder, value, changeHandler, label }) => {
  return (
    <>
      <label htmlFor="input" className={styles.label}>
        {label}
      </label>
      <input
        id="input"
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={(e) => {
          if (e.target.value === "" || regex.test(e.target.value))
            changeHandler(e.target.value);
        }}
        className={styles.input}
      />
    </>
  );
};

export default CustomInput;
