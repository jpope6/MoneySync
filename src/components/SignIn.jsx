import React, { useState } from "react";
import Input from "./Input";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";


const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

    const signIn = (e) => {
        e.preventDefault();

        setError('');

        if (!email || !password) {
            setError('Required field.');
        } else if (!validateEmail(email)) {
            setError('Invalid email.')
        } else if (email && password) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredentials) => {
                    console.log(userCredentials);
                    setEmail('');
                    setPassword('');
                })
                .catch((error) => {
                    console.log(error);

                    if (error.code === 'auth/invalid-login-credentials') {
                        setError('User does not exist. Please Sign Up')
                    } else {
                        setError('An error occered during sign in.');
                    }
                })
        }
    };

    return (
        <div className="sign-in-container">
            <form onSubmit={signIn}>
                <h1>Log in</h1>
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
                <p className="error-message">{error}</p>
                <button type="submit">Log In</button>
            </form>
        </div>
    );
};

export default SignIn;
