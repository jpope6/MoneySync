import React, { useState } from "react";
import Input from "./Input";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";


const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        const regex =
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    }

    const signUp = (e) => {
        e.preventDefault();

        setError('');

        if (!email || !password || !confirmPassword) {
            setError('Required field.');
        } else if (!validateEmail(email)) {
            setError('Invalid email.')
        } else if (password !== confirmPassword) {
            setError('Passwords do not match');
        } else {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredentials) => {
                    console.log(userCredentials);
                    setEmail('');
                    setPassword('');
                })
                .catch((error) => {
                    console.log(error);

                    if (error.code === 'auth/email-already-in-use') {
                        setError('Email already in use.')
                    } else {
                        setError('An error occered during sign in.');
                    }
                })
        }
    };

    return (
        <div className="sign-in-container">
            <form onSubmit={signUp}>
                <h1>Create an account</h1>
                <Input
                    type="text"
                    placeHolder={"Email"}
                    value={email}
                    callback={handleEmailChange}
                    error={error}
                />
                <Input
                    type="password"
                    placeHolder={"Password"}
                    value={password}
                    callback={handlePasswordChange}
                    error={error}
                />
                <Input
                    type="password"
                    placeHolder={"Confirm Password"}
                    value={confirmPassword}
                    callback={handleConfirmPasswordChange}
                    error={error}
                />
                <p className="error-message">{error}</p>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;
