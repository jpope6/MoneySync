import React from "react";
import "../styles/input.css";

const Input = ({ type, placeHolder, value, callback, error }) => {
	return (
		<input
			type={type}
			className={`sign-input ${error ? "error" : ""}`}
			onChange={callback}
			value={value}
			placeholder={placeHolder}
		/>
	);
};

export default Input;
