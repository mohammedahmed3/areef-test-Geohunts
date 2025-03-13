import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { firestore } from '../firebase-config';

const LeaderboardScreen = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [filter, setFilter] = useState('weekly'); // Default to weekly leaderboard

  // Fetch leaderboard data from Firestore
  useEffect(() => {
    const fetchLeaderboard = async () => {
      const snapshot = await firestore.collection(`leaderboards`).doc(filter).get();
      if (snapshot.exists) {
        const data = snapshot.data().rankings || [];
        setLeaderboard(data.sort((a, b) => b.points - a.points)); // Sort by points descending
      }
    };

    fetchLeaderboard();
  }, [filter]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard ({filter})</Text>

      {/* Filter Buttons */}
      <View style={styles.filter}>
        {['daily', 'weekly', 'monthly', 'all-time'].map((time) => (
          <TouchableOpacity
            key={time}
            style={[
              styles.filterButton,
              filter === time ? styles.activeFilter : styles.inactiveFilter
            ]}
            onPress={() => setFilter(time)}>
            <Text>{time.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Leaderboard List */}
      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.userId}
        renderItem={({ item, index }) => (
          <View style={styles.rankItem}>
            <Text>{index + 1}. {item.username}</Text>
            <Text>{item.points} Points</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  filter: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  filterButton: { paddingHorizontal: 10, paddingVertical: 5, marginHorizontal: 5 },
  activeFilter: { backgroundColor: '#d1e7ff', borderRadius: 5 },
  inactiveFilter: { backgroundColor: '#f0f0f0' },
  rankItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});

export default LeaderboardScreen;