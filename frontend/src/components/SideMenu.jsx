import React, { useState } from "react";
import Modal from 'react-modal';

import { useUserBanks } from "../hooks/useBankData";

import "../styles/side-menu.css";
import "../styles/modal.css";

Modal.setAppElement("#root");


const SideMenu = ({ bankNames, updateBankNames, currentSelection, updateCurrentSelection }) => {
    const { addBank } = useUserBanks();
    const [modalOpen, setModalOpen] = useState(false);
    const [fadeAway, setFadeAway] = useState(false);
    const [bankName, setBankName] = useState('');
    const [isUniqueBankName, setIsUniqueBankName] = useState(true);

    const handleModalOpen = () => {
        setModalOpen(true);
    }

    const handleModalClose = () => {
        setFadeAway(true);
        setTimeout(() => {
            setModalOpen(false);
            setFadeAway(false);
            setBankName('');
            setIsUniqueBankName(true);
        }, 200);
    }

    const handleItemClick = (menuItem) => {
        updateCurrentSelection(menuItem);
    }

    const handleInputChange = (e) => {
        const newBankName = e.target.value
        setBankName(newBankName);

        if (bankNames.includes(newBankName)) {
            setIsUniqueBankName(false);
        } else {
            setIsUniqueBankName(true);
        }
    }

    const handleModalSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!isUniqueBankName) {
                return;
            }


            await addBank(bankName);
            updateBankNames(bankName);
            setBankName('');
            setModalOpen(false);
        } catch (error) {
            console.error("Error adding a bank:", error);
        }
    }

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
                className={`modal ${fadeAway ? "fade-away" : ""}`}
                style={{
                    overlay: {
                        background: "rgba(0, 0, 0, 0.7)",
                    },
                }}
            >
                <div>
                    <input
                        type="text"
                        placeholder="Add a bank"
                        value={bankName}
                        onChange={handleInputChange}
                        autoFocus
                    />
                    {!isUniqueBankName && <p style={{ color: 'red' }}>Bank name already exists!</p>}
                </div>
                <button type="submit" onClick={handleModalSubmit}>Submit</button>
                <button className="modal-button" onClick={handleModalClose}>Close Modal</button>
            </Modal>
        </div>
    );
};

export default SideMenu;
