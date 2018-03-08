// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.addVar = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    var varKey = req.query.varKey;
    var varValue = req.query.varValue;
// Push the new message into the Realtime Database using the Firebase Admin SDK.
    var ref = admin.database().ref('/variables');
    ref.push({varKey: varKey, varValue: varValue});
    return res.send('Saved data store');


})
;


exports.getVariables = functions.https.onRequest((req, res) => {
    var ref = admin.database().ref('/variables');
    ref.on("value", function (snapshot) {
        console.log(snapshot.val());
        res.status(200).send(snapshot.val());
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
})
;