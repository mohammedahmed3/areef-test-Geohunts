## **1. Firebase Setup**
**Step 1: Initialize Firebase**
1. Create a Firebase project in the [Firebase Console](https://firebase.google.com/).
2. Enable:
    - Firestore Database.
    - Firebase Authentication (use Email/Password signup + Google Login).
    - Firebase Functions.

3. Get your Firebase configuration and include it in your app.

**Add dependencies to your React Native project:**
``` bash
npm install firebase @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
npm install react-native-maps
```
