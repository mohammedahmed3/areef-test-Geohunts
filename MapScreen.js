import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { firestore } from '../firebase-config';

const MapScreen = () => {
  const [treasures, setTreasures] = useState([]);

  useEffect(() => {
    const fetchTreasures = async () => {
      const treasuresSnapshot = await firestore.collection("treasures").get();
      const treasuresData = treasuresSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setTreasures(treasuresData);
    };
    fetchTreasures();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 40.742,
          longitude: -73.935,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1
        }}
      >
        {treasures.map((treasure) => (
          <Marker
            key={treasure.id}
            coordinate={{
              latitude: treasure.location.lat,
              longitude: treasure.location.lng
            }}
            title={treasure.name}
            description={`Rarity: ${treasure.rarity}`}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 }
});

export default MapScreen;