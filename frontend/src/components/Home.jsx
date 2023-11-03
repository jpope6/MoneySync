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
    const { fetchBankNames, fetchBankData, fetchAllBanksData } = useUserBanks();
    const [bankNames, setBankNames] = useState([]);
    const [currentSelection, setCurrentSelection] = useState('All');
    const [data, setData] = useState([]);
    const [allData, setAllData] = useState({});

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
                    const fetchedBankData = await fetchAllBanksData();
                    setAllData(fetchedBankData);
                } else {
                    const fetchedBankData = await fetchBankData(currentSelection);

                    fetchedBankData.forEach((bankData) => {
                        setData((prevData) => [
                            ...prevData,
                            {
                                date: bankData.date,
                                checkings: bankData.checkings,
                                savings: bankData.savings,
                                other: bankData.other,
                                timestamp: bankData.timestamp
                            },
                        ]);
                    });
                }
            } catch (error) {
                console.error("Error fetching bank data:", error);
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
                        <AllBanksGraph
                            data={allData}
                            setAllData={setAllData}
                        />
                        <AllBanksTable
                            data={allData}
                        />
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
