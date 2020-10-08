importScripts('https://www.gstatic.com/firebasejs/7.22.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.22.1/firebase-messaging.js');

firebase.initializeApp({
 apiKey: "AIzaSyCeLbWV4OeB3i5VKYdKmkInihs42mZD1Sk",
 authDomain: "counter-michalstejskal.firebaseapp.com",
 databaseURL: "https://counter-michalstejskal.firebaseio.com",
 projectId: "counter-michalstejskal",
 storageBucket: "counter-michalstejskal.appspot.com",
 messagingSenderId: "824668391509",
 appId: "1:824668391509:web:bd179a57473557d16aacdc",
 measurementId: "G-SYR9QP0CX3"
});
const messaging = firebase.messaging(); 