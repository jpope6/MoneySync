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
    const [data, setData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [fadeAway, setFadeAway] = useState(false);
    const { addBankEntry, deleteBankEntries } = useUserBanks();
    const [category, setCategory] = useState('');
    const [columnDefs, setColumnDefs] = useState([
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

    console.log(rowData);

    // useEffect(() => {
    //     const categories = Object.keys(rowData[0]).filter(key => key !== 'month');
    //     setData(categories.map(category => {
    //         const categoryData = { category };
    //         rowData.forEach(entry => {
    //             categoryData[entry.month] = entry[category];
    //         });
    //         return categoryData;
    //     }));
    // }, []);

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            sortable: true,
            resizable: true,
            editable: true,
        };
    }, []);

    const handleCellValueChange = (params) => {
        const { colDef, newValue } = params;
        const updatedRowData = data.map((row) => {
            if (row.month === data.month) {
                return { ...row, [colDef.field]: newValue };
            }
            return row;
        });
        updateRowData(updatedRowData);
    }

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
            // await addBankEntry(
            //     bankName,
            //     date,
            //     checkings,
            //     savings,
            //     other
            // );
            // addRow({ date: date, checkings: checkings, savings: savings, other: other });
            // setCheckings(0);
            // setSavings(0);
            // setOther(0);
            setModalOpen(false);
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

                <input type="text" name='category' id="category-input" value={category} onChange={handleInputChange} />

                <button className="modal-button" onClick={handleModalSubmit}>Add Entry</button>
            </Modal>
        </div>
    );
};

export default BankTable;
