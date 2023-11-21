import React, { useState, useEffect } from "react";
import SideMenu from "./SideMenu";
import Header from "./Header";
import AllBanksGraph from "./AllBanksGraph";
import BankGraph from "./BankGraph";
import AllBanksTable from "./AllBanksTable";
import BankTable from "./BankTable";
import DropdownFilter from "./DropdownFilter";
import YearSelector from "./YearSelector";

import { useUserBanks } from "../hooks/useBankData";

import '../styles/home.css';


const Home = () => {
    const { fetchBankNames, fetchBankData, fetchAllBanksData } = useUserBanks();
    const [bankNames, setBankNames] = useState([]);
    const [currentSelection, setCurrentSelection] = useState('All');
    const [data, setData] = useState([]);
    const [allData, setAllData] = useState({});
    const [colorData, setColorData] = useState({
        Checkings: 'black',
        Savings: 'red',
        House: 'green',
        Car: 'pink',
        Boat: 'gray',
    });
    const [filteredData, setFilteredData] = useState([]);

    const getCurrentYear = () => {
        return new Date().getFullYear().toString();
    };

    // Set the filter to be defaulted to January-December of Current Year
    const [selectedToMonth, setSelectedToMonth] = useState(`${getCurrentYear()}-01`);
    const [selectedFromMonth, setSelectedFromMonth] = useState(`${getCurrentYear()}-12`);
    const [selectedYear, setSelectedYear] = useState([getCurrentYear()]);

    useEffect(() => {
        const currentYear = getCurrentYear();
        setSelectedToMonth(`${currentYear}-01`);
        setSelectedFromMonth(`${currentYear}-12`);
    }, []);


    const updateBankNames = (bankName) => {
        setBankNames(bankNames => [...bankNames, bankName]);
    }

    const updateCurrentSelection = (newSelection) => {
        if (newSelection === currentSelection) {
            return;
        }

        setCurrentSelection(newSelection);
    }


    const updateData = (newData) => {
        setAllData((prevAllData) => ({
            ...prevAllData,
            [currentSelection]: newData,
        }));
    };

    // Fetch bank data
    useEffect(() => {
        async function fetchAllData() {
            try {
                const fetchedBankData = await fetchBankData();
                setAllData(fetchedBankData);
                console.log(allData);
            } catch (error) {
                console.error("Error fetching bank data:", error);
            }
        }
        fetchAllData();
        console.log(allData);
    }, []);


    // Fetch the bankNames array from the database to load them onto the side menu
    // TODO: Should this go into the SideMenu component?
    useEffect(() => {
        async function fetchBanks() {
            try {
                const fetchedBankNames = await fetchBankNames();
                setBankNames(fetchedBankNames);
            } catch (error) {
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
                <DropdownFilter
                    selectedToMonth={selectedToMonth}
                    selectedFromMonth={selectedFromMonth}
                    setSelectedToMonth={setSelectedToMonth}
                    setSelectedFromMonth={setSelectedFromMonth}
                />
                {currentSelection === 'All' ?
                    <>
                        {/*
                        <AllBanksGraph
                            data={Object.keys(filteredData).length === 0 ? allData : filteredData}
                            setAllData={setAllData}
                        />
                        <AllBanksTable
                            data={Object.keys(filteredData).length === 0 ? allData : filteredData}
                        />
                        */}
                    </>
                    :
                    <>
                        <BankGraph
                            data={allData[selectedYear][currentSelection]}
                            colorData={colorData}
                        />


                        <YearSelector
                            selectedYear={selectedYear}
                            setSelectedYear={setSelectedYear}
                        />
                        <BankTable
                            bankName={currentSelection}
                            rowData={allData[selectedYear][currentSelection]}
                            updateRowData={updateData}
                            selectedYear={selectedYear}
                        />
                    </>
                }
            </div>
        </div>
    );
};

export default Home;
