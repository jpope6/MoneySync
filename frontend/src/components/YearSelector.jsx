import React from 'react';

import "../styles/year-selector.css";

const YearSelector = ({ selectedYear, setSelectedYear, setSelectedToMonth, setSelectedFromMonth }) => {
    const currentYear = new Date().getFullYear();

    const handleDecrement = () => {
        setSelectedYear(selectedYear - 1);
        setSelectedToMonth(`${selectedYear - 1}-01`)
        setSelectedFromMonth(`${selectedYear - 1}-12`)
    };

    const handleIncrement = () => {
        setSelectedYear(selectedYear + 1);
        setSelectedToMonth(`${selectedYear + 1}-01`)
        setSelectedFromMonth(`${selectedYear + 1}-12`)
    };

    return (
        <div className="year-selector">
            <button
                onClick={handleDecrement}
                disabled={selectedYear <= currentYear - 30}
            >
                &lt;
            </button>

            <span className='words'>{selectedYear}</span>

            <button
                onClick={handleIncrement}
                disabled={selectedYear >= currentYear}
            >
                &gt;
            </button>
        </div>
    );
};

export default YearSelector;
