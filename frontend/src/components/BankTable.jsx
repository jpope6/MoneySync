import React, { useState, useCallback, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const BankTable = () => {
    const gridRef = useRef();
    const [rowData, setRowData] = useState([
        { date: new Date("2023-10-19T00:00:00").toLocaleDateString() },
    ]);

    const columnDefs = [
        { headerCheckboxSelection: true, checkboxSelection: true, maxWidth: 50 },
        { field: 'date', headerName: 'Date' },
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

    // const sizeToFit = useCallback(() => {
    //     gridRef.current.api.sizeColumnsToFit();
    // }, []);

    const addRow = () => {
        const copy = [...rowData];
        const newBank = { bank: 'Bank', checkings: '100', savings: '200' }
        copy.push(newBank);
        setRowData(copy);
        // sizeToFit();
    }

    return (
        <div className="ag-theme-alpine-dark"
            style={{ width: '100%', paddingTop: '2rem' }}>
            <button onClick={addRow}>Add Entry</button>
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                rowSelection='multiple'
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                domLayout='autoHeight'
            />
        </div>
    );
};

export default BankTable;
