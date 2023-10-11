import React from "react";
import Header from "./Header";
import Graph from "./Graph";

import '../styles/home.css';

const Home = () => {

    return (
        <div className="home">
            <Header />
            <div className="main-content">
                <Graph />
            </div>
        </div>
    );
};

export default Home;
