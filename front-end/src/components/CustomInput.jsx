/* eslint-disable react/prop-types */
import React from "react";

const CustomInput = ({ placeholder, value, handler, label }) => {
  return (
    <div>
      <label htmlFor="input">{label}</label>
      <input
        id="input"
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={handler}
      />
    </div>
  );
};

export default CustomInput;
