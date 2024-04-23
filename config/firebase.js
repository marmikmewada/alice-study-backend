// config/firebase.js

const admin = require('firebase-admin');
// const path = require('path');

// Load Firebase service account key
const serviceAccount = require("../test-todo-d8179-firebase-adminsdk-ha9tc-20adc473f7.json");;

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://test-todo-d8179.appspot.com' 
});

// Get a reference to the Firebase Storage service
const storage = admin.storage();  

module.exports = storage;
