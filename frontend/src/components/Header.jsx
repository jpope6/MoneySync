import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";

import '../styles/header.css';

const Header = ({ title }) => {
    const navigate = useNavigate();
    const [auth, setAuth] = useContext(AuthContext);
    const [user, setUser] = useContext(UserContext);

    const handleSignOut = () => {
        localStorage.removeItem('auth');
        localStorage.removeItem('user');
        setUser(null);
        setAuth(false);
        navigate('/signin');
    }


    return (
        <div className="header">
            <h1 className="header-title">{ title === 'All' ? 'All Banks' : title }</h1>
            <button type="button" className="link-button" onClick={handleSignOut}>
                Sign Out
            </button>
        </div>
    );
};

export default Header;
