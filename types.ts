export interface Monitor {
    location: string;
    latitude: number | null;
    longitude: number | null;
    serial_number: string;
    label: string;
    last_calibrated: string | null;
}
