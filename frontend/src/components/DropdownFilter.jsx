import React, { useState } from 'react';

import "../styles/dropdown-filter.css";

const DropdownFilter = ({ filter, setFilter, selectedMonth, setSelectedMonth, selectedYear, setSelectedYear }) => {

    const handleChangeFilter = event => {
        setFilter(event.target.value);
    }

    const handleMonthChange = event => {
        setSelectedMonth(event.target.value);
    }

    const handleYearChange = event => {
        setSelectedYear(event.target.value);
    }

    return (
        <div className='main-filter'>
            <label htmlFor="filter">Filter: </label>
            <select
                name="filter"
                id="filter"
                value={filter}
                onChange={handleChangeFilter}
            >
                <option value="">None</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
            </select>

            {filter === 'month' && (
                <div>
                    <label htmlFor="selectedMonth">Select Month: </label>
                    <input
                        type="month"
                        id="selectedMonth"
                        name="selectedMonth"
                        value={selectedMonth}
                        onChange={(event) => setSelectedMonth(event.target.value)}
                    />
                </div>
            )}

            {filter === 'year' && (
                <div>
                    <label htmlFor="selectedYear">Select Year: </label>
                    <input
                        type="number"
                        id="selectedYear"
                        name="selectedYear"
                        min="1900"
                        max="2099"
                        step="1"
                        value={selectedYear}
                        onChange={(event) => setSelectedYear(event.target.value)}
                    />
                </div>
            )}
        </div>
    )
};

export default DropdownFilter;
