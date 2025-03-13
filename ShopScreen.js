import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { firestore, auth } from '../firebase-config';

const ShopScreen = () => {
  const [items, setItems] = useState([]);
  const [userStars, setUserStars] = useState(0);

  useEffect(() => {
    // Fetch shop items
    const fetchItems = async () => {
      const snapshot = await firestore.collection('shopItems').get();
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    };

    // Fetch user stars
    const fetchUser = async () => {
      const userDoc = await firestore.collection('users').doc(auth.currentUser.uid).get();
      setUserStars(userDoc.data().stars);
    };

    fetchItems();
    fetchUser();
  }, []);

  // Handle purchase
  const buyItem = async (item) => {
    if (userStars < item.price) {
      alert('Not enough stars!');
      return;
    }

    await firestore.collection('users').doc(auth.currentUser.uid).update({
      stars: userStars - item.price,
    });

    alert('Purchase successful!');
    setUserStars(userStars - item.price);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop</Text>
      <Text>Your Stars: {userStars}</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.shopItem}>
            <Text>{item.name}</Text>
            <Text>Price: {item.price} Stars</Text>
            <Button title="Buy" onPress={() => buyItem(item)} />
          </View>
        )}
        style={{ marginTop: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  shopItem: { padding: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 10 },
});

export default ShopScreen;