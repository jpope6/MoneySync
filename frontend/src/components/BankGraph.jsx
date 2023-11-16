import React, { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";


const BankGraph = ({ data, colorData }) => {
    console.log(data);
    // Extract categories and months from the data
    const categories = (Array.isArray(data) && data.map((entry) => entry.category)) || [];
    let months = (
        Array.isArray(data) && data.length > 0
            ? Object.keys(data[0]).filter((key) => key !== 'category')
            : []
    ) || [];

    // Sort the months
    months = months.sort((a, b) => {
        const monthOrder = [
            "January", "February", "March", "April",
            "May", "June", "July", "August",
            "September", "October", "November", "December"
        ];
        return monthOrder.indexOf(a) - monthOrder.indexOf(b);
    });

    // Reformat data for LineChart
    const chartData = months.map((month) => {
        const entry = { month };
        categories.forEach((category) => {
            entry[category] = data.find((d) => d.category === category)[month];
        });
        return entry;
    });

    // Determine the smallest and largest values for YAxis domain
    const allValues = chartData.reduce(
        (acc, entry) => acc.concat(Object.values(entry)
            .slice(1)
            .filter(value => value !== null)),
        []
    );
    const smallestValue = Math.min(...allValues);
    const largestValue = Math.max(...allValues);

    return (
        <ResponsiveContainer width='100%' height={700}>
            <LineChart
                data={chartData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="month"
                    type="category"
                />
                <YAxis
                    domain={[smallestValue, largestValue]}
                />
                <Tooltip />
                <Legend />
                {categories.map(category => (
                    <Line
                        key={category}
                        type="monotone"
                        dataKey={category}
                        name={category}
                        stroke={colorData[category]}
                        activeDot={{ r: 8 }}
                        strokeWidth={3}
                        connectNulls
                    />
                ))}
            </LineChart>
        </ResponsiveContainer >
    );
};

export default BankGraph;
