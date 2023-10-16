import React, { useState, useContext } from "react";
import Input from "./Input";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import SignForm from "./SignForm";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";

import '../styles/signin.css';
import Spinner from "./Spinner";


const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
                    setLoading(true);

                    localStorage.setItem("auth", JSON.stringify(true));
                    localStorage.setItem("user", JSON.stringify(userCredentials));
                    setUser(userCredentials);
                    setAuth(true);
                    navigate('/home');
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

        <div className="sign-in">
            <SignForm
                title={'Sign In'}
                subheading={'Sign in to start tracking your finances.'}>

                <form className="form" onSubmit={signIn}>
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
                    </div>
                    <p className="error-message">{error}</p>
                    <button className="sign-button" type="submit">
                        {loading ? <Spinner /> : 'Log in'}
                    </button>
                </form>
                <div className="sign-additional">
                    <span>Not a member? </span>
                    <Link to="/signup" className="sign-link">
                        Sign Up.
                    </Link>
                </div>
            </SignForm>
        </div>
    );
};

export default SignIn;
