import React from "react";
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

const data = [
    {
        date: "10/5/23",
        amt: 2400
    },
    {
        date: "10/6/23",
        amt: 2210
    },
    {
        date: "10/7/23",
        amt: 2290
    },
    {
        date: "10/8/23",
        amt: 2000
    },
    {
        date: "10/9/23",
        amt: 2181
    },
    {
        date: "10/10/23",
        amt: 2500
    },
    {
        date: "10/11/23",
        amt: 2100
    }
];

const Graph = () => {
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
                />
                <YAxis
                    domain={[1900, 2600]}
                />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="amt"
                    stroke="#F64C72"
                    activeDot={{ r: 8 }}
                    strokeWidth={3}
                />
            </LineChart>
        </ResponsiveContainer >
    );
};

export default Graph;
