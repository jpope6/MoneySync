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

    const handleModalOpen = () => {
        setModalOpen(true);
    }

    const handleModalClose = () => {
        setFadeAway(true);
        setTimeout(() => {
            setModalOpen(false);
            setFadeAway(false);
        }, 200);
    }

    const handleItemClick = (menuItem) => {
        updateCurrentSelection(menuItem);
    }

    const handleInputChange = (e) => {
        setBankName(e.target.value);
    }

    const handleModalSubmit = async (e) => {
        e.preventDefault();

        try {
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
                <input type="text" placeholder="Add a bank" onChange={handleInputChange} autoFocus />
                <button type="submit" onClick={handleModalSubmit}>Submit</button>
                <button className="modal-button" onClick={handleModalClose}>Close Modal</button>
            </Modal>
        </div>
    );
};

export default SideMenu;
