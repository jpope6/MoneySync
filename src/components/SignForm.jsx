import React from "react";
import "../styles/sign-form.css";

const SignForm = ({ children, title, subheading }) => {
	return (
		<div className="sign-form">
			<h1 className="title">{title}</h1>
			<h2 className="subheading">{subheading}</h2>
			{children}
		</div>
	);
};

export default SignForm;
