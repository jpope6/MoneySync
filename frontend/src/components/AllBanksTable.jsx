import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

const AllBanksTable = ({ data }) => {
    const gridRef = useRef();
    const [rowData, setRowData] = useState([]);

    const columnDefs = [
        { headerCheckboxSelection: true, checkboxSelection: true, maxWidth: 50 },
        { field: 'date', sort: 'desc' },
        { field: 'name' },
        { field: 'total' },
        {
            field: 'totalDifference', cellStyle: (params) => {
                if (params.value < 0) {
                    // Apply a red background for negative values
                    return { color: 'red' };
                } else if (params.value > 0) {
                    // Apply a green background for positive values
                    return { color: 'green' };
                }
                // Default style for zero or null values
                return null;
            },
            valueFormatter: (params) => {
                // Check if the totalDifference is a number
                if (typeof params.value === 'number') {
                    // Format the value with a plus sign
                    return `${params.value > 0 ? '+' : ''}${params.value}`;
                }
                // Return the original value for non-numeric values
                return params.value;
            },
        },
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

    useEffect(() => {
        async function fetchBanks() {
            try {
                const allBankData = Object.values(data).flat();
                const filteredData = allBankData.filter(entry => entry.total !== null);
                const sortedData = filteredData.sort((a, b) => a.timestamp - b.timestamp);

                setRowData(sortedData);
            } catch (error) {
                // Handle the error, e.g., show an error message to the user
                console.error("Error fetching banks:", error);
            }
        }
        fetchBanks();
    }, [data]);

    return (
        <div className="ag-theme-alpine-dark"
            style={{ width: '100%', paddingTop: '2rem' }}>
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
