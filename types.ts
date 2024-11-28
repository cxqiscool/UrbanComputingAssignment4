export interface Monitor {
    location: string;
    latitude: number | null;
    longitude: number | null;
    serial_number: string;
    label: string;
    last_calibrated: string | null;
}

export interface MonitorData {
    id: number;
    serialNumber: string;
    datetime: [number, number, number, number, number]; // [Year, Month, Day, Hour, Minute]
    laeq: number;
}