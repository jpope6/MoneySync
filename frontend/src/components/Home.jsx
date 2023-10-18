import React from "react";
import SideMenu from "./SideMenu";
import Header from "./Header";
import Graph from "./Graph";

import '../styles/home.css';
import Table from "./Table";

const Home = () => {

    return (
        <div className="home">
            <SideMenu />
            <div className="main-content">
                <Header />
                <Graph />
                <Table />
            </div>
        </div>
    );
};

export default Home;
