import React from 'react';

import "../styles/filter.css";

const Filter = ({ selectedToMonth, selectedFromMonth, setSelectedToMonth, setSelectedFromMonth }) => {

    const getCurrentYear = () => {
        return new Date().getFullYear().toString();
    };

    const handleClearFilter = () => {
        setSelectedToMonth(`${getCurrentYear()}-01`);
        setSelectedFromMonth(`${getCurrentYear()}-12`);
    }

    return (
        <div className='main-filter'>
            <div className='filter-content'>
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
            <button onClick={handleClearFilter}>Clear filter</button>
        </div>
    )
};

export default Filter;
