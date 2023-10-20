import React, { useState, useMemo, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

const AllBanksTable = () => {
    const gridRef = useRef();
    const [rowData, setRowData] = useState([
        { bank: 'Bank of America', checkings: '1000', savings: '1000' },
        { bank: 'Chase', checkings: '2000', savings: '1500' },
        { bank: 'Altura', checkings: '3000', savings: '1700' },
    ]);

    const columnDefs = [
        { headerCheckboxSelection: true, checkboxSelection: true, maxWidth: 50 },
        { field: 'bank' },
        { field: 'checkings' },
        { field: 'savings' },
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

    return (
        <div className="ag-theme-alpine-dark" 
            style={{ width: '100%',  paddingTop: '2rem' }}>
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

export default AllBanksTable;
