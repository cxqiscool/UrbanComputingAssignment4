import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { MonitorData } from './types';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

interface DataPopupProps {
    data: MonitorData[];
    onClose: () => void;
}

const DataPopup: React.FC<DataPopupProps> = ({ data, onClose }) => {
    // Calculate analysis metrics
    const averageNoise = (data.reduce((sum, item) => sum + item.laeq, 0) / data.length).toFixed(2);
    const peakNoise = Math.max(...data.map((item) => item.laeq)).toFixed(2);
    const thresholdCount = data.filter((item) => item.laeq > 80).length;

    // Format the data for the chart
    const chartData = {
        labels: data.map((item) => {
            const [year, month, day, hour, minute] = item.datetime;
            return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        }),
        datasets: [
            {
                label: 'LAeq (Noise Level)',
                data: data.map((item) => item.laeq),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4, // Smooth curve
            },
        ],
    };

    return (
        <div className="data-popup-overlay" onClick={onClose}>
            <div className="data-popup" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    ×
                </button>
                <h2>Monitor Data Analysis</h2>
                <div className="analysis-summary">
                    <p><strong>Average Noise Level:</strong> {averageNoise} dB</p>
                    <p><strong>Peak Noise Level:</strong> {peakNoise} dB</p>
                    <p><strong>Readings Above Threshold (80 dB):</strong> {thresholdCount}</p>
                </div>
                <div className="chart-container">
                    <Line
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false, // Hide legend to save space
                                },
                            },
                            scales: {
                                x: {
                                    ticks: {
                                        font: {
                                            size: 10, // Smaller font size for x-axis
                                        },
                                    },
                                },
                                y: {
                                    ticks: {
                                        font: {
                                            size: 10, // Smaller font size for y-axis
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default DataPopup;
