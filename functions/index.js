// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.addObject = functions.https.onRequest((req, res) => {

    var googleId = req.query.googleId;
    var dataStoreId = req.query.dataStoreId;
// Push the new message into the Realtime Database using the Firebase Admin SDK.
    var ref = admin.database().ref('/variables/' + googleId +'/'+dataStoreId);

    var obj = {};
    for (var varKey in req.query) {
        if (req.query.hasOwnProperty(varKey)) {
            var objValue = req.query[varKey].toString();
            obj[varKey] = objValue;
                  }
    }
    ref.push(obj);
    console.log("Saved map: "+ varKey+" "+ req.query[varKey])

    return res.send('Saved data stored successfully');
});

exports.updateObject = functions.https.onRequest((req, res) => {
    var googleId = req.query.googleId;
    var dataStoreId = req.query.dataStoreId;
    var ref = admin.database().ref('/variables/' + googleId +'/'+dataStoreId);

    var obj = {};
    for (var varKey in req.query) {
        if (req.query.hasOwnProperty(varKey)) {
            var objValue = req.query[varKey].toString();
            obj[varKey] = objValue;
        }
    }

    var taskId = req.query.taskId;

    ref.orderByChild('taskId').equalTo(taskId).once("value", function (snapshot) {
        console.log(snapshot.val());

        snapshot.forEach(function(child) {
            child.ref.update(obj);
        });
        res.status(200).send("Data is updated successfully");
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
});

exports.deleteObject = functions.https.onRequest((req, res) => {
    var googleId = req.query.googleId;
    var dataStoreId = req.query.dataStoreId;
    var ref = admin.database().ref('/variables/' + googleId +'/'+dataStoreId);

    var taskId = req.query.taskId;
    ref.orderByChild('taskId').equalTo(taskId).once("value", function (snapshot) {
        console.log(snapshot.val());

        snapshot.forEach(function(child) {
            child.ref.remove();
        });
        res.status(200).send("Deleted Shamefully");
        res.end();
    }, function (errorObject) {
        console.log("The delete failed: " + errorObject.code);
    });
});


exports.getAlldataOfDataStore = functions.https.onRequest((req, res) => {
    var googleId = req.query.googleId;
    var dataStoreId = req.query.dataStoreId;
    var ref = admin.database().ref('/variables/' + googleId +'/'+dataStoreId);

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



