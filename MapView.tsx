import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Monitor, MonitorData } from './types';
import L, { Map as LeafletMap } from 'leaflet'; // Import Leaflet Map type
import 'leaflet/dist/leaflet.css';
import DataPopup from './DataPopup';

const customIcon = L.icon({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface MapViewProps {
    monitors: Monitor[];
    selectedMonitor: Monitor | null;
}

interface WeatherData {
    temperature: number;
    weather: string;
    windSpeed: number;
}

const MapView: React.FC<MapViewProps> = ({ monitors, selectedMonitor }) => {
    const position: [number, number] = [53.35, -6.26];
    const [selectedMonitorData, setSelectedMonitorData] = useState<MonitorData[] | null>(null);
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loadingData, setLoadingData] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const mapRef = useRef<LeafletMap | null>(null);

    useEffect(() => {
        if (selectedMonitor && mapRef.current) {
            const { latitude, longitude } = selectedMonitor;

            if (latitude !== null && longitude !== null) {
                mapRef.current.setView([latitude, longitude], 14, { animate: true });

                // Fetch weather data for the selected sensor
                fetchWeatherData(latitude, longitude);
            }
        }
    }, [selectedMonitor]);

    const fetchWeatherData = async (lat: number, lon: number) => {
        const apiKey = 'ffe78564703b6f98f4570809e0fb531e';
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
            );
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }
            const weather = await response.json();
            setWeatherData({
                temperature: weather.main.temp,
                weather: weather.weather[0].description,
                windSpeed: weather.wind.speed,
            });
        } catch (err) {
            console.error(err);
            setWeatherData(null);
        }
    };

    const fetchMonitorData = async (serialNumber: string) => {
        setLoadingData(true);
        setError(null);
        try {
            const response = await fetch(`http://51.145.37.128:8080/api/monitors/${serialNumber}/data`);
            if (!response.ok) {
                throw new Error('Failed to fetch monitor data');
            }
            const data: MonitorData[] = await response.json();
            setSelectedMonitorData(data);
        } catch (err) {
            console.error(err);
            setError('Error fetching monitor data');
        } finally {
            setLoadingData(false);
        }
    };

    return (
        <>
            <MapContainer
                center={position}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                whenReady={(event) => {
                    mapRef.current = event.target as LeafletMap; // Set map reference properly
                }}
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {monitors.map((monitor) => {
                    if (monitor.latitude !== null && monitor.longitude !== null) {
                        return (
                            <Marker
                                key={monitor.serial_number}
                                position={[monitor.latitude, monitor.longitude]}
                                icon={customIcon}
                                eventHandlers={{
                                    click: () => {
                                        fetchMonitorData(monitor.serial_number);
                                    },
                                }}
                            >
                                <Popup>
                                    <div style={{ textAlign: 'center' }}>
                                        <h3>{monitor.label}</h3>
                                        <p>{monitor.location}</p>
                                        {weatherData ? (
                                            <>
                                                <p>
                                                    <strong>Weather:</strong> {weatherData.weather}
                                                </p>
                                                <p>
                                                    <strong>Temperature:</strong>{' '}
                                                    {weatherData.temperature} °C
                                                </p>
                                                <p>
                                                    <strong>Wind Speed:</strong>{' '}
                                                    {weatherData.windSpeed} m/s
                                                </p>
                                            </>
                                        ) : (
                                            <p>Loading weather data...</p>
                                        )}
                                        <button onClick={() => fetchMonitorData(monitor.serial_number)}>
                                            View Chart
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    }
                    return null;
                })}
            </MapContainer>

            {selectedMonitorData && (
                <DataPopup
                    data={selectedMonitorData}
                    onClose={() => {
                        setSelectedMonitorData(null);
                        setWeatherData(null); // Reset weather data when popup closes
                    }}
                />
            )}
            {loadingData && <div className="loading-overlay">Loading data...</div>}
            {error && <div className="error-overlay">{error}</div>}
        </>
    );
};

export default MapView;
