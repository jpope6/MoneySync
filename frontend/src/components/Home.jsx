import React, { useState, useEffect } from "react";
import SideMenu from "./SideMenu";
import Header from "./Header";
import AllBanksGraph from "./AllBanksGraph";
import BankGraph from "./BankGraph";
import AllBanksTable from "./AllBanksTable";
import BankTable from "./BankTable";
import DropdownFilter from "./DropdownFilter";

import { useUserBanks } from "../hooks/useBankData";

import '../styles/home.css';


const Home = () => {
    const { fetchBankNames, fetchBankData, fetchAllBanksData } = useUserBanks();
    const [bankNames, setBankNames] = useState([]);
    const [currentSelection, setCurrentSelection] = useState('All');
    const [data, setData] = useState([]);
    const [allData, setAllData] = useState({});
    const [filteredData, setFilteredData] = useState({});
    const [filter, setFilter] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState(parseInt(new Date().getFullYear(), 10));

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

    // Filter data
    useEffect(() => {
        const filtered = {};

        for (const bankName in allData) {
            const bankData = allData[bankName];

            const filteredEntries = bankData.filter((entry) => {
                const entryYear = entry.date.split('-')[0];
                const entryMonth = entry.date.split('-')[1];

                if (filter === 'year') {
                    return entryYear == selectedYear;
                } else if (filter === 'month') {
                    return entryYear + '-' + entryMonth == selectedMonth;
                }
            });

            if (filteredEntries.length > 0) {
                filtered[bankName] = filteredEntries;
            }
        }

        setFilteredData(filtered);
    }, [filter, selectedMonth, selectedYear]);


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
                <DropdownFilter
                    filter={filter}
                    setFilter={setFilter}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}

                />
                {currentSelection === 'All' ?
                    <>
                        <AllBanksGraph
                            data={Object.keys(filteredData).length === 0 ? allData : filteredData}
                            setAllData={setAllData}
                        />
                        <AllBanksTable
                            data={Object.keys(filteredData).length === 0 ? allData : filteredData}
                        />
                    </>
                    :
                    <>
                        <BankGraph
                            data={Object.keys(filteredData).length === 0
                                ?
                                data
                                :
                                filteredData[currentSelection].filter(entry => entry.total != null)}
                        />
                        <BankTable
                            bankName={currentSelection}
                            rowData={Object.keys(filteredData).length === 0
                                ?
                                data
                                :
                                filteredData[currentSelection].filter(entry => entry.total != null)}
                            updateRowData={setData}
                        />
                    </>
                }
            </div>
        </div>
    );
};

export default Home;
