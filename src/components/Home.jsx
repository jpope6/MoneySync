import React from "react";
import SideMenu from "./SideMenu";
import Header from "./Header";
import Graph from "./Graph";

import '../styles/home.css';

const Home = () => {

    return (
        <div className="home">
            <SideMenu />
            <div className="main-content">
                <Header />
                <Graph />
            </div>
        </div>
    );
};

export default Home;
