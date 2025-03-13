import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { firestore } from '../firebase-config';

const PartnersScreen = () => {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const fetchPartners = async () => {
      const snapshot = await firestore.collection('partners').get();
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPartners(data);
    };

    fetchPartners();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Our Partners</Text>

      <FlatList
        data={partners}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.partner}>
            <Image source={{ uri: item.logoUrl }} style={styles.logo} />
            <Text>{item.name}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  partner: { marginBottom: 20, alignItems: 'center' },
  logo: { width: 100, height: 100, marginBottom: 10 },
});

export default PartnersScreen;