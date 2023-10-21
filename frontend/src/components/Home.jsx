import React, { useState, useEffect } from "react";
import SideMenu from "./SideMenu";
import Header from "./Header";
import AllBanksGraph from "./AllBanksGraph";
import BankGraph from "./BankGraph";
import AllBanksTable from "./AllBanksTable";
import BankTable from "./BankTable";

import { useUserBanks } from "../hooks/useBankData";

import '../styles/home.css';

const Home = () => {
    const { fetchBankNames, fetchBankData } = useUserBanks();
    const [bankNames, setBankNames] = useState([]);
    const [currentSelection, setCurrentSelection] = useState('All');
    const [data, setData] = useState([]);
    const [resetGraph, setResetGraph] = useState(false);

    const updateBankNames = (bankName) => {
        setBankNames(bankNames => [...bankNames, bankName]);
    }

    const updateCurrentSelection = (newSelection) => {
        if (newSelection === currentSelection) {
            return;
        }


        setCurrentSelection(newSelection);
        setData([]);
    }

    const updateData = (data) => {
        setData(data);
    }

    const updateResetGraph = (resetGraph) => {
        setResetGraph((resetGraph) => !resetGraph);
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

    useEffect(() => {
        async function fetchData() {
            try {
                if (currentSelection === 'All') {
                    return;
                }

                const fetchedBankData = await fetchBankData(currentSelection);

                fetchedBankData.forEach((bankData) => {

                    setData((prevData) => [
                        ...prevData,
                        {
                            date: bankData.date,
                            checkings: bankData.checkings,
                            savings: bankData.savings,
                            other: bankData.other
                        },
                    ]);

                })

            } catch (error) {
                console.error("Error fetching bank names:", error);
            }
        }
        fetchData();
    }, [currentSelection]);

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
                {currentSelection === 'All' ?
                    <>
                        <AllBanksGraph />
                        <AllBanksTable />
                    </>
                    :
                    <>
                        <BankGraph
                            data={data}
                        />
                        <BankTable
                            bankName={currentSelection}
                            rowData={data}
                            updateRowData={updateData}
                        />
                    </>
                }
            </div>
        </div>
    );
};

export default Home;
