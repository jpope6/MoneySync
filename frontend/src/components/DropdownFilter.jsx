import React, { useState } from 'react';

import "../styles/dropdown-filter.css";

const DropdownFilter = ({ selectedToMonth, selectedFromMonth, setSelectedToMonth, setSelectedFromMonth }) => {
    return (
        <div className='main-filter'>
            <label htmlFor="selectedFromMonth">From</label>
            <input
                type="month"
                id="selectedToMonth"
                name="selectedToMonth"
                value={selectedToMonth}
                onChange={(event) => setSelectedToMonth(event.target.value)}
            />

            <label htmlFor="selectedToMonth">To</label>
            <input
                type="month"
                id="selectedFromMonth"
                name="selectedFromMonth"
                value={selectedFromMonth}
                onChange={(event) => setSelectedFromMonth(event.target.value)}
            />
        </div>
    )
};

export default DropdownFilter;
