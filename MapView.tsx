// MapView.tsx

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Monitor } from './types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Set default icon options with external URLs
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
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
