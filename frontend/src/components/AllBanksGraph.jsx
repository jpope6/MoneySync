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

const AllBanksGraph = ({ data }) => {
    const [smallestValue, setSmallestValue] = useState(Number.POSITIVE_INFINITY);
    const [largestValue, setLargestValue] = useState(Number.NEGATIVE_INFINITY);

    useEffect(() => {
        // Calculate smallestValue and largestValue based on visible series
        let smallest = Number.POSITIVE_INFINITY;
        let largest = Number.NEGATIVE_INFINITY;

        data.forEach((item) => {
            const num = Math.round(item.total);

            console.log(item.name);

            if (num < smallest) {
                smallest = num;
            }

            if (num > largest) {
                largest = num;
            }
        });

        setSmallestValue(smallest);
        setLargestValue(largest);
    }, [data]);

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
                    domain={[smallestValue, largestValue]}
                />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#F64C72"
                    activeDot={{ r: 8 }}
                    strokeWidth={3}
                />
            </LineChart>
        </ResponsiveContainer >
    );
};

export default AllBanksGraph;
