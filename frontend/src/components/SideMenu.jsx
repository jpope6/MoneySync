import React, { useEffect, useState } from "react";
import Modal from 'react-modal';

import { useUserBanks } from "../hooks/useBankNames";

import "../styles/side-menu.css";

Modal.setAppElement("#root");


const SideMenu = () => {
    const { addBank, fetchBankNames } = useUserBanks();
    const [modalOpen, setModalOpen] = useState(false);
    const [bankName, setBankName] = useState('');
    const [currentSelection, setCurrentSelection] = useState('All');
    const [bankNames, setBankNames] = useState([]);

    const handleModalOpen = () => {
        setModalOpen(true);
    }

    const handleModalClose = () => {
        setModalOpen(false);
    }

    const handleItemClick = (menuItem) => {
        setCurrentSelection(menuItem);
    }

    const handleInputChange = (e) => {
        setBankName(e.target.value);
    }

    const handleModalSubmit = async (e) => {
        e.preventDefault();

        try {
            await addBank(bankName);
            setBankNames(bankNames => [...bankNames, bankName]);
            setBankName('');
            setModalOpen(false);
        } catch (error) {
            // Handle the error, e.g., show an error message to the user
            console.error("Error adding a bank:", error);
        }
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
        <div className="menu">
            <button className="menu-button" onClick={handleModalOpen}>Add bank</button>
            <ul className="menu-list">
                <li className={`menu-item ${currentSelection === 'All' ? 'selected-menu-item' : ''} `}
                    onClick={() => handleItemClick('All')}
                >All</li>
                {bankNames.map((bankName, index) => (
                    <li
                        key={index}
                        className={`menu-item ${currentSelection === bankName ? 'selected-menu-item' : ''} `}
                        onClick={() => handleItemClick(bankName)}
                    >
                        {bankName}
                    </li>
                ))}

            </ul>

            <Modal
                isOpen={modalOpen}
            >
                <input type="text" placeholder="Add a bank" onChange={handleInputChange} />
                <button type="submit" onClick={handleModalSubmit}>Submit</button>
                <button className="modal-button" onClick={handleModalClose}>Close Modal</button>
            </Modal>
        </div>
    );
};

export default SideMenu;
