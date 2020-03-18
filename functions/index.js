'use strict';
const functions = require('firebase-functions');
const express = require('express');
const app = express();
const admin = require('firebase-admin');
admin.initializeApp();
var firestore = admin.firestore();

// middleware
const cors = require('cors');
app.use(cors);



// hello api

// Try: https://mtest-6ff8e.firebaseapp.com/say/hello in the similar way if you are having firebase billing account configured

// or https://mtest-6ff8e.firebaseapp.com/say/hello?name=Madhu

// Here are some useful object available in each REQUEST ("req" variable), which can be used to provide dynamic response based on input value.
//  * Query Data Object:  req.query
//  * Post Data Object:   req.body
//  * Path parameter:     req.params
//  * Header Data Object: req.headers

app.get('/say/hello', (req,res) => { 

    console.log("request query params",req.query);
    if(req.query.hasOwnProperty('name') && req.query.name != ''){
        return res.status(200).json({"message":"Hello "+ req.query.name+" ....! Welcome to mock api"});
    }
    else {
        return res.status(200).json({"message":"Hello there .... Welcome to mock api"});
    }
});


app.get('/Add', (req,res) => { 

    firestore.collection("cities").doc("LA").set({
        name: "Los Angeles",
        state: "CA",
        country: "USA"
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });

});



/**
 * Simple request that extracts data from firebase firestore (database)
 * --------------------------------------------------------------------------------------
 * Try: https://mtest-6ff8e.firebaseapp.com/userProfile/bob
 */
app.get('/userProfile/:userId', (req, res) => {
    var docRef = firestore.collection("userProfiles").doc(req.params.userId);
  
    // See https://firebase.google.com/docs/firestore/query-data/get-data#get_a_document
    docRef.get().then((doc) => {
        if (doc.exists) {
            return res.status(200).json(doc.data());
        } else {
            return res.status(400).json({"message":"User ID not found."});
        }
    }).catch((error) => {
        return res.status(400).json({"message":"Unable to connect to Firestore."});
    });
  });
  /* [END `/userProfile` ] */

// api should point to firebase.json rewrites
exports.api = functions.https.onRequest(app);