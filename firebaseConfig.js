const admin = require("firebase-admin");

const serviceAccount = require('./key.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "diningwebsite-25476.appspot.com"
});

module.exports = admin;