// App.tsx

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Monitor } from './types';
import MapView from './MapView';

export default function App() {
    const [data, setData] = useState<Monitor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch('http://localhost:8080/api/monitors')
            .then((response) => response.json())
            .then((json) => {
                setData(json);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    const renderItem = ({ item }: { item: Monitor }) => (
        <View style={styles.item}>
            <Text style={styles.title}>{item.label}</Text>
            <Text>Location: {item.location}</Text>
            <Text>Serial Number: {item.serial_number}</Text>
            <Text>Last Calibrated: {item.last_calibrated || 'N/A'}</Text>
            <Text>
                Coordinates: {item.latitude ?? 'N/A'}, {item.longitude ?? 'N/A'}
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading data...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.listContainer}>
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.serial_number}
                    renderItem={renderItem}
                />
            </View>
            <View style={styles.mapContainer}>
                <MapView monitors={data} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row', // Arrange children in a row (side by side)
    },
    listContainer: {
        flex: 1, // Occupies less space
        maxWidth: '30%', // Optional: Define a specific width
        backgroundColor: '#f0f0f0', // Optional: Background for visibility
    },
    mapContainer: {
        flex: 3, // Occupies more space
        backgroundColor: '#fff', // Optional: Background for visibility
    },
    item: {
        backgroundColor: '#e0f7fa',
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
    },
});
