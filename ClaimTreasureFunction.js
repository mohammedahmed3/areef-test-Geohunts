   const admin = require('firebase-admin');

   exports.claimTreasure = functions.https.onCall(async (data, context) => {
     const { treasureId, userId } = data;

     const treasureRef = admin.firestore().collection('treasures').doc(treasureId);
     const treasureDoc = await treasureRef.get();

     if (!treasureDoc.exists || treasureDoc.data().claimedBy) {
       throw new functions.https.HttpsError('not-found', 'Treasure already claimed.');
     }

     await treasureRef.update({ claimedBy: userId, timeClaimed: admin.firestore.Timestamp.now() });

     const userRef = admin.firestore().collection('users').doc(userId);
     const userData = await userRef.get();

     await userRef.update({ points: userData.data().points + treasureDoc.data().content.amount });

     return { status: 'success', message: 'Treasure claimed!' };
   });