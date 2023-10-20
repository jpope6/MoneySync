import React, { useState, useEffect } from "react";
import SideMenu from "./SideMenu";
import Header from "./Header";
import Graph from "./Graph";
import AllBanksTable from "./AllBanksTable";
import BankTable from "./BankTable";

import { useUserBanks } from "../hooks/useBankNames";

import '../styles/home.css';

const Home = () => {
    const { fetchBankNames } = useUserBanks();
    const [bankNames, setBankNames] = useState([]);
    const [currentSelection, setCurrentSelection] = useState('All');

    const updateBankNames = (bankName) => {
        setBankNames(bankNames => [...bankNames, bankName]);
    }

    const updateCurrentSelection = (selection) => {
        setCurrentSelection(selection);
    }

    useEffect(() => {
        async function fetchBanks() {
            try {
                const fetchedBankNames = await fetchBankNames();
                setBankNames(fetchedBankNames);
            } catch (error) {
                // Handle the error, e.g., show an error message to the user
                console.error("Error fetching bank names:", error);
            }
        }
        fetchBanks();
    }, []);

    return (
        <div className="home">
            <SideMenu 
                bankNames={bankNames}
                updateBankNames={updateBankNames}
                currentSelection={currentSelection}
                updateCurrentSelection={updateCurrentSelection}
            />
            <div className="main-content">
                <Header
                    title={currentSelection}
                />
                <Graph />
                {currentSelection === 'All' ?
                    <AllBanksTable />
                    :
                    <BankTable />
                }
            </div>
        </div>
    );
};

export default Home;
