import React, { useState } from "react";
import Modal from 'react-modal';

import "../styles/side-menu.css";

Modal.setAppElement("#root");


const SideMenu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleModalOpen = () => {
        setModalOpen(true);
    }

    const handleModalClose = () => {
        setModalOpen(false);
    }

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    }

    const handleModalSubmit = () => {
        const menuItemsCopy = [...menuItems];
        menuItemsCopy.push(inputValue);
        setMenuItems(menuItemsCopy);
        setInputValue('');
        setModalOpen(false);
    }

    return (
        <div className="menu">
            <button className="menu-button" onClick={handleModalOpen}>Add bank</button>
            <ul className="menu-list">
                {menuItems.map((menuItem, index) => (
                    <li
                        key={index}
                        className='menu-item'
                    >
                        {menuItem}
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
