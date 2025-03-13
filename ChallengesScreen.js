import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Button } from 'react-native';
import { firestore } from '../firebase-config';

const ChallengesScreen = () => {
  const [challenges, setChallenges] = useState([]);

  // Fetch challenges from Firestore
  useEffect(() => {
    const fetchChallenges = async () => {
      const snapshot = await firestore.collection('challenges').get();
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setChallenges(data);
    };
    fetchChallenges();
  }, []);

  // Handle voting
  const castVote = async (challengeId, submissionId) => {
    const challengeDoc = firestore.collection('challenges').doc(challengeId);
    await challengeDoc.update({
      submissions: firestore.FieldValue.arrayUnion({
        submissionId,
        votes: firestore.FieldValue.increment(1),
      }),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Challenges</Text>

      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.challengeItem}>
            <Text style={styles.challengeTitle}>{item.title}</Text>

            {/* List of user submissions for voting */}
            <FlatList
              data={item.submissions}
              keyExtractor={(sub) => sub.submissionId}
              renderItem={({ item: sub }) => (
                <View style={styles.submission}>
                  <Image source={{ uri: sub.imageUrl }} style={styles.image} />
                  <Text>{sub.username}</Text>
                  <Text>Votes: {sub.votes}</Text>
                  <Button title="Vote" onPress={() => castVote(item.id, sub.submissionId)} />
                </View>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  challengeItem: { marginBottom: 20 },
  challengeTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  submission: { alignItems: 'center', marginRight: 15 },
  image: { width: 100, height: 100, borderRadius: 10, marginBottom: 5 },
});

export default ChallengesScreen;