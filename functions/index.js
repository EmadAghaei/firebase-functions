// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.addVar = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    var varKey = req.query.varKey;
    var varValue = req.query.varValue;
    var googleId = req.query.googleId;
    var dataStoreId = req.query.dataStoreId;
// Push the new message into the Realtime Database using the Firebase Admin SDK.
    var ref = admin.database().ref('/variables/' + googleId +'/'+dataStoreId);
    // ref.push({varKey: varKey, varValue: varValue});
    ref.push({varKey : varKey, varValue: varValue});
    return res.send('Saved data store');
});


exports.getAlldataOfDataStore = functions.https.onRequest((req, res) => {
    var googleId = req.query.googleId;
    var ref = admin.database().ref('/variables/' + googleId +'/'+req.query.dataStoreId.toString());

   ref.on("value", function (snapshot) {
        console.log(snapshot.val());
        res.status(200).send(snapshot.val());
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
});

exports.getAlldataOfUser = functions.https.onRequest((req, res) => {
    var googleId = req.query.googleId;
    var  ref = admin.database().ref('/variables/' + googleId);
    ref.on("value", function (snapshot) {
        console.log(snapshot.val());
        res.status(200).send(snapshot.val());
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
});

exports.updateVar = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    var varKey = req.query.varKey;
    var varValue = req.query.varValue;
    var googleId = req.query.googleId;
    var dataStoreId = req.query.dataSoreId;
// Push the new message into the Realtime Database using the Firebase Admin SDK.
    var ref = admin.database().ref('/variables/' + googleId+'/'+dataStoreId.toString());

    ref.orderByChild('varKey').equalTo(varKey).on("value", function (snapshot) {
        console.log(snapshot.val());

        snapshot.forEach(function(child) {
            child.ref.update({varValue: varValue.toString()});
        });
        res.status(200).send(snapshot.val());
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
});
