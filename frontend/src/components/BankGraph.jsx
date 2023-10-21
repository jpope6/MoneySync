import React, { useState } from "react";
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


const BankGraph = ({ data }) => {
    data = data.sort((a, b) => new Date(a.date) - new Date(b.date));

    let smallest = Number.POSITIVE_INFINITY;
    let largest = Number.NEGATIVE_INFINITY;
    data.forEach(item => {
        let num = Math.min(item.checkings, item.savings, item.other);
        if (num < smallest) {
            smallest = num;
        }

        num = Math.max(item.checkings, item.savings, item.other);
        if (num > largest) {
            largest = num;
        }
    })

    return (
        <ResponsiveContainer width='100%' height={700}>
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    tickFormatter={
                        (date) => new Date(date)
                            .toLocaleDateString('en-US', {
                                month: '2-digit',
                                day: '2-digit',
                                year: '2-digit'
                            })
                    }
                />
                <YAxis
                    domain={[smallest, largest]}
                />
                <Tooltip />
                <Legend />
                {/* Line for Checkings */}
                <Line
                    type="monotone"
                    dataKey="checkings"
                    name="Checkings"
                    stroke="#F64C72"
                    activeDot={{ r: 8 }}
                    strokeWidth={3}
                />

                {/* Line for Savings */}
                <Line
                    type="monotone"
                    dataKey="savings"
                    name="Savings"
                    stroke="#5AA4FC"
                    activeDot={{ r: 8 }}
                    strokeWidth={3}
                />

                {/* Line for Other */}
                <Line
                    type="monotone"
                    dataKey="other"
                    name="Other"
                    stroke="#36A2A3"
                    activeDot={{ r: 8 }}
                    strokeWidth={3}
                />
            </LineChart>
        </ResponsiveContainer >
    );
};

export default BankGraph;
