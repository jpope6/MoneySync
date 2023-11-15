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
    const [allData, setAllData] = useState({
        'Chase': [
            {
                category: 'Checkings',
                January: 600,
                February: 600,
                March: 700,
                April: 750,
                May: 800,
                June: 850,
                July: 900,
                August: 950,
                September: 1000,
                October: 1050,
                November: 1100,
                December: 1150
            },
            {
                category: 'Savings',
                January: 800,
                February: 800,
                March: 850,
                April: 900,
                May: 950,
                June: 1000,
                July: 1050,
                August: 1100,
                September: 1150,
                October: 1200,
                November: 1250,
                December: 1300
            },
            {
                category: 'House',
                January: 900,
                February: 900,
                March: 950,
                April: 1000,
                May: 1100,
                June: 1200,
                July: 1300,
                August: 1400,
                September: 1500,
                October: 1600,
                November: 1700,
                December: 1800
            },
            {
                category: 'Car',
                January: 350,
                February: 350,
                March: 400,
                April: 420,
                May: 450,
                June: 480,
                July: 500,
                August: 520,
                September: 550,
                October: 580,
                November: 600,
                December: 620
            },
            {
                category: 'Boat',
                January: 500,
                February: 500,
                March: 550,
                April: 580,
                May: 600,
                June: 620,
                July: 650,
                August: 680,
                September: 700,
                October: 720,
                November: 750,
                December: 780
            },
        ],
    });
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
        setData(newData);
    };


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
                            data={allData[currentSelection]}
                            colorData={colorData}
                        />
                        <BankTable
                            bankName={currentSelection}
                            rowData={allData[currentSelection]}
                            updateRowData={updateData}
                        />
                    </>
                }
            </div>
        </div>
    );
};

export default Home;
