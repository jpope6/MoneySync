import React from 'react';

const YearSelector = ({ selectedYear, setSelectedYear }) => {
    const currentYear = new Date().getFullYear();

    const handleDecrement = () => {
        setSelectedYear(selectedYear - 1);
    };

    const handleIncrement = () => {
        setSelectedYear(selectedYear + 1);
    };

    return (
        <div className="year-selector">
            <button
                onClick={handleDecrement}
                disabled={selectedYear <= currentYear - 30}
            >
                &lt;
            </button>

            <span>{selectedYear}</span>

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
