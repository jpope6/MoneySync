import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Modal from 'react-modal';

import { useUserBanks } from '../hooks/useBankData';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import '../styles/bank-table.css';
import '../styles/modal.css';

Modal.setAppElement("#root");

const defaultRow = {
    category: null,
    January: null,
    February: null,
    March: null,
    April: null,
    May: null,
    June: null,
    July: null,
    August: null,
    September: null,
    October: null,
    November: null,
    December: null,
};

const BankTable = ({ bankName, rowData, updateRowData, selectedYear }) => {
    const gridRef = useRef();
    const [data, setData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [fadeAway, setFadeAway] = useState(false);
    const { addBankEntry, deleteEntries } = useUserBanks();
    const [category, setCategory] = useState('');
    const [columnDefs, setColumnDefs] = useState([
        { headerCheckboxSelection: true, checkboxSelection: true, maxWidth: 50 },
        { field: 'category', headerName: 'Category' },
        { field: 'January', headerName: 'January' },
        { field: 'February', headerName: 'February' },
        { field: 'March', headerName: 'March' },
        { field: 'April', headerName: 'April' },
        { field: 'May', headerName: 'May' },
        { field: 'June', headerName: 'June' },
        { field: 'July', headerName: 'July' },
        { field: 'August', headerName: 'August' },
        { field: 'September', headerName: 'September' },
        { field: 'October', headerName: 'October' },
        { field: 'November', headerName: 'November' },
        { field: 'December', headerName: 'December' }
    ]);


    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            sortable: true,
            resizable: true,
            editable: true,
        };
    }, []);


    const handleCellValueChange = async (params) => {
        const { colDef, newValue } = params;
        const updatedRowData = rowData.map((row) => {
            if (row.month === rowData.month && row.category === rowData.category) {
                return { ...row, [colDef.field]: newValue };
            }
            return row;
        });

        updateRowData(updatedRowData);
        await addBankEntry(selectedYear, bankName, updatedRowData);
    }

    const addRow = async ({ categoryName }) => {
        const updatedData = [
            ...rowData,
            {
                category: categoryName,
                January: null,
                February: null,
                March: null,
                April: null,
                May: null,
                June: null,
                July: null,
                August: null,
                September: null,
                October: null,
                November: null,
                December: null,
            },
        ];

        updateRowData(updatedData);
        await addBankEntry(selectedYear, bankName, updatedData);
    }

    const handleModalOpen = () => {
        setModalOpen(true);
    }

    const handleModalClose = () => {
        setFadeAway(true);
        setTimeout(() => {
            setModalOpen(false);
            setFadeAway(false);
            setCategory('');
        }, 200);
    }

    const handleDeleteSelectedRows = async () => {
        const selectedNodes = gridRef.current.api.getSelectedNodes();
        const selectedRowData = selectedNodes.map(node => node.data);
        gridRef.current.api.applyTransaction({ remove: selectedRowData });

        let updatedRowData = [...rowData];


        selectedRowData.forEach(row => {
            updatedRowData = updatedRowData.filter(item =>
                item.category !== row.category
            );

        });

        console.log(updatedRowData);

        updateRowData(updatedRowData);

        // Update the row data with the filtered row data
        await deleteEntries(selectedYear, bankName, selectedRowData);
    }

    const handleModalSubmit = (e) => {
        e.preventDefault();

        try {
            addRow({ categoryName: category });
            setModalOpen(false);
            setCategory('');
        } catch (error) {
            console.error("Error adding a bank:", error);
        }
    }


    const handleInputChange = (e) => {
        setCategory(e.target.value);
    }

    return (
        <div className="ag-theme-alpine-dark"
            style={{ width: '100%', paddingTop: '2rem' }}>
            <button onClick={handleModalOpen}>Add Category</button>
            <button onClick={handleDeleteSelectedRows}>Delete Selected Rows</button>
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                rowSelection='multiple'
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                domLayout='autoHeight'
                onCellValueChanged={handleCellValueChange}
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
                    <h2>Add New Category</h2>
                    <button className="close-button" onClick={handleModalClose}>
                        X
                    </button>
                </div>

                <input
                    type="text"
                    name='category'
                    id="category-input"
                    value={category}
                    onChange={handleInputChange}
                    autoComplete='off'
                    autoFocus
                />

                <button className="modal-button" onClick={handleModalSubmit}>Add Category</button>
            </Modal>
        </div>
    );
};

export default BankTable;
