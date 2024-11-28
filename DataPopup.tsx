import React from 'react';
import { MonitorData } from './types';

interface DataPopupProps {
    data: MonitorData[];
    onClose: () => void;
}

const DataPopup: React.FC<DataPopupProps> = ({ data, onClose }) => {
    return (
        <div className="data-popup-overlay" onClick={onClose}>
            <div className="data-popup" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    ×
                </button>
                <h2>Monitor Data</h2>
                <ul>
                    {data.map((item) => (
                        <li key={item.id}>
                            <strong>DateTime:</strong> {formatDateTime(item.datetime)}
                            <br />
                            <strong>LAeq:</strong> {item.laeq}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const formatDateTime = (datetime: [number, number, number, number, number]) => {
    const [year, month, day, hour, minute] = datetime;
    return `${year}-${month.toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}`;
};

export default DataPopup;
