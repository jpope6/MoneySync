import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Modal from 'react-modal';

import { useUserBanks } from '../hooks/useBankData';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import '../styles/bank-table.css';
import '../styles/modal.css';

Modal.setAppElement("#root");

const BankTable = ({ bankName, rowData, updateRowData }) => {
    const gridRef = useRef();
    const [modalOpen, setModalOpen] = useState(false);
    const [fadeAway, setFadeAway] = useState(false);
    const { addBankEntry, deleteBankEntries } = useUserBanks();
    const [selectedRows, setSelectedRows] = useState([])
    const [date, setDate] = useState(new Date().toJSON().slice(0, 10));
    const [checkings, setCheckings] = useState(0);
    const [savings, setSavings] = useState(0);
    const [other, setOther] = useState(0);

    const columnDefs = [
        { headerCheckboxSelection: true, checkboxSelection: true, maxWidth: 50 },
        {
            field: 'date', headerName: 'Date', sort: 'desc',
        },
        { field: 'checkings', headerName: 'Checkings' },
        { field: 'savings', headerName: 'Savings' },
        { field: 'other', headerName: 'Other' },
    ];

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            minWidth: 180,
            sortable: true,
            resizable: true,
            editable: true,
        };
    }, []);

    const addRow = ({ date, checkings, savings, other }) => {
        updateRowData((prevRowData) => [
            ...prevRowData,
            { date: date, checkings: checkings, savings: savings, other: other },
        ]);
    }

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

    const handleDeleteSelectedRows = async () => {
        const selectedNodes = gridRef.current.api.getSelectedNodes();
        const selectedRowData = selectedNodes.map(node => node.data);
        gridRef.current.api.applyTransaction({ remove: selectedRowData });

        let updatedRowData = [...rowData];


        selectedRowData.forEach(row => {
            updatedRowData = updatedRowData.filter(item =>
                item.date !== row.date ||
                item.checkings !== row.checkings ||
                item.savings !== row.savings ||
                item.other !== row.other
            );

        });

        console.log(updatedRowData);

        updateRowData(updatedRowData);

        await deleteBankEntries(bankName, selectedRowData);
    }

    const handleModalSubmit = async (e) => {
        e.preventDefault();

        try {
            await addBankEntry(
                bankName,
                date,
                checkings,
                savings,
                other
            );
            addRow({ date: date, checkings: checkings, savings: savings, other: other });
            setDate(new Date().toJSON().slice(0, 10));
            setCheckings(0);
            setSavings(0);
            setOther(0);
            setModalOpen(false);
        } catch (error) {
            console.error("Error adding a bank:", error);
        }
    }


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'date') {
            setDate(value);
        } else if (name === 'checkings') {
            setCheckings(parseFloat(value).toFixed(2));
        } else if (name === 'savings') {
            setSavings(parseFloat(value).toFixed(2));
        } else if (name === 'other') {
            setOther(parseFloat(value).toFixed(2));
        }
    }

    return (
        <div className="ag-theme-alpine-dark"
            style={{ width: '100%', paddingTop: '2rem' }}>
            <button onClick={handleModalOpen}>Add Entry</button>
            <button onClick={handleDeleteSelectedRows}>Delete Selected Rows</button>
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                rowSelection='multiple'
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                domLayout='autoHeight'
            />

            <Modal
                isOpen={modalOpen}
                className={`modal ${fadeAway ? "fade-away" : ""}`}
                style={{
                    overlay: {
                        background: "rgba(0, 0, 0, 0.7)",
                    },
                }}
            >

                <div className="modal-header">
                    <button className="close-button" onClick={handleModalClose}>
                        X
                    </button>
                </div>

                <div className="input-container">
                    <label htmlFor="date-input">Date:</label>
                    <input type="date" name='date' id="date-input" value={date} onChange={handleInputChange} />
                </div>

                <div className="input-container">
                    <label htmlFor="checkings-input">Checkings:</label>
                    <input type="number" name='checkings' id="checkings-input" onChange={handleInputChange} />
                </div>

                <div className="input-container">
                    <label htmlFor="savings-input">Savings:</label>
                    <input type="number" name='savings' id="savings-input" onChange={handleInputChange} />
                </div>

                <div className="input-container">
                    <label htmlFor="other-input">Other:</label>
                    <input type="number" name='other' id="other-input" onChange={handleInputChange} />
                </div>
                <button className="modal-button" onClick={handleModalSubmit}>Add Entry</button>
            </Modal>
        </div>
    );
};

export default BankTable;
