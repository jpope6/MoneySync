import React, { useState, useContext } from "react";
import Input from "./Input";
import SignForm from "./SignForm";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
import Spinner from "./Spinner";

import '../styles/signin.css';

const SignUp = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [authContext, setAuth] = useContext(AuthContext);
    const [user, setUser] = useContext(UserContext);
    const [loading, setLoading] = useState('');

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
                    setLoading(true);
                    console.log(userCredentials);

                    const user = userCredentials.user;
                    const userDocRef = doc(db, 'users', user.uid);

                    const userData = {
                        email: user.email,
                    };

                    setDoc(userDocRef, userData)
                        .then(() => {
                            console.log('User document created successfully');
                            localStorage.setItem("auth", JSON.stringify(true));
                            localStorage.setItem("user", JSON.stringify(userCredentials));
                            setUser(userCredentials);
                            setAuth(true);
                            navigate('/home');
                        })
                        .catch((error) => {
                            console.error('Error creating user document:', error);
                        });
                })
                .catch((error) => {
                    console.log(error);

                    if (error.code === 'auth/email-already-in-use') {
                        setError('Email already in use.')
                    } else {
                        setError('An error occered during sign in.');
                    }
                })

            setLoading(false);
        }
    };

    return (
        <div className="sign-in">
            <SignForm
                title={'Create an Account'}
                subheading={'Sign up to start tracking your finances.'}>

                <form className="form" onSubmit={signUp}>
                    <div className="sign-inputs">
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
                    </ div>
                    <p className="error-message">{error}</p>

                    <button className="sign-button" type="submit">
                        {loading ? <Spinner /> : 'Sign Up'}
                    </button>
                </form>
                <div className="sign-additional">
                    <span>Already have an account? </span>
                    <Link to="/signin" className="sign-link">
                        Sign In.
                    </Link>
                </div>
            </SignForm>
        </div>
    );
};

export default SignUp;
