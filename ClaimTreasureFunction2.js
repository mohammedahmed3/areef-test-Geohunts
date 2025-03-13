const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.claimTreasure = functions.https.onCall(async (data, context) => {
  const { treasureId, userId } = data;

  const treasureRef = admin.firestore().collection("treasures").doc(treasureId);
  const treasureDoc = await treasureRef.get();

  if (!treasureDoc.exists || treasureDoc.data().claimedBy) {
    throw new functions.https.HttpsError("not-found", "Treasure is not available.");
  }

  await treasureRef.update({ claimedBy: userId });

  const userRef = admin.firestore().collection("users").doc(userId);
  const userDoc = await userRef.get();
  await userRef.update({
    points: userDoc.data().points + treasureDoc.data().content.amount
  });

  return { success: true, message: "Treasure claimed successfully!" };
});