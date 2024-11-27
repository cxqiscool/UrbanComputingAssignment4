// MapView.tsx

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Monitor } from './types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define a custom icon
const customIcon = L.icon({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41], // Size of the icon
    iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
    shadowSize: [41, 41], // Size of the shadow
});

interface MapViewProps {
    monitors: Monitor[];
}

const MapView: React.FC<MapViewProps> = ({ monitors }) => {
    const position: [number, number] = [53.35, -6.26]; // Center of Dublin

    return (
        <MapContainer
            center={position}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            {monitors.map((monitor) => {
                if (monitor.latitude !== null && monitor.longitude !== null) {
                    return (
                        <Marker
                            key={monitor.serial_number}
                            position={[monitor.latitude, monitor.longitude]}
                            icon={customIcon} // Use the custom icon here
                        >
                            <Popup>
                                <strong>{monitor.label}</strong>
                                <br />
                                {monitor.location}
                            </Popup>
                        </Marker>
                    );
                }
                return null;
            })}
        </MapContainer>
    );
};

export default MapView;
