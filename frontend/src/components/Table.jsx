import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

const Table = () => {
    const gridRef = useRef();
    const [rowData, setRowData] = useState([
        { bank: 'Bank of America', checkings: '1000', savings: '1000' },
        { bank: 'Chase', checkings: '2000', savings: '1500' },
        { bank: 'Altura', checkings: '3000', savings: '1700' },
    ]);

    const [columnDefs] = useState([
        { field: 'bank' },
        { field: 'checkings' },
        { field: 'savings' },
    ]);

    const sizeToFit = useCallback(() => {
        gridRef.current.api.sizeColumnsToFit();
    }, []);

    const addRow = () => {
        const copy = [...rowData];
        const newBank = { bank: 'Bank', checkings: '100', savings: '200' }
        copy.push(newBank);
        setRowData(copy);
        sizeToFit();
    }

    return (
        <div className="ag-theme-alpine-dark" 
            style={{ width: '100%',  paddingTop: '2rem' }}>
            <button onClick={addRow}>Push me</button>
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                onGridReady={sizeToFit}
                onGridSizeChanged={sizeToFit}
                domLayout='autoHeight'
            />
        </div>
    );
};

export default Table;
