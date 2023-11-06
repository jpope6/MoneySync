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
import Colorful from '@uiw/react-color-colorful';
import { useUserBanks } from "../hooks/useBankData";

const AllBanksGraph = ({ data, setAllData }) => {
    const [smallestValue, setSmallestValue] = useState(Number.POSITIVE_INFINITY);
    const [largestValue, setLargestValue] = useState(Number.NEGATIVE_INFINITY);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [color, setColor] = useState('black');
    const [bankName, setBankName] = useState('');
    const { changeBankStrokeColor } = useUserBanks();

    useEffect(() => {

        console.log(data);
        if (!Array.isArray(data) || data.length === 0) {
            return; // Data is not in the expected format or is empty
        }


        // Calculate smallestValue and largestValue based on the data object
        let smallest = Number.POSITIVE_INFINITY;
        let largest = Number.NEGATIVE_INFINITY;

        for (const bank of data) {
            const num = Math.round(bank.total);
            if (num < smallest) {
                smallest = num;
            }
            if (num > largest) {
                largest = num;
            }
        }

        setSmallestValue(smallest);
        setLargestValue(largest);
    }, [data]);

    const handleLegendClick = (e) => {
        setShowColorPicker((showColorPicker) => !showColorPicker);
        setBankName(e);
    }

    const handleColorChange = (e) => {
        setColor(e.hex);
    };

    const handleColorSubmit = () => {
        const updatedData = { ...data };
        updatedData[bankName].forEach((entry) => {
            entry.color = color;
        });
        setAllData(updatedData);
        changeBankStrokeColor(bankName, color);
        setShowColorPicker(false);
    };

    return (
        <>
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
                        type="category"
                        tickFormatter={
                            (date) => new Date(date)
                                .toLocaleDateString('en-US', {
                                    month: '2-digit',
                                    day: '2-digit',
                                    year: '2-digit'
                                })
                        }
                        allowDuplicatedCategory={false}
                    />
                    <YAxis
                        domain={[smallestValue, largestValue]}
                    />
                    <Tooltip />
                    <Legend
                        onClick={(e) => {
                            handleLegendClick(e.payload.name);
                        }}
                    />

                    {Object.keys(data).map((bankName, index) => (
                        <Line
                            key={index}
                            type="monotone"
                            dataKey="total"
                            data={data[bankName]}
                            name={bankName}
                            stroke={data[bankName][0].color}
                            fill={'pink'}
                            strokeWidth={3}
                            connectNulls
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer >
            {showColorPicker && (
                <div className='color-picker'>
                    <Colorful
                        color={color}
                        disableAlpha={true}
                        onChange={handleColorChange}
                    />
                    <button onClick={handleColorSubmit}>Change</button>
                </div>
            )}
        </>
    );
};

export default AllBanksGraph;
