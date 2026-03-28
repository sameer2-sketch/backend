const admin = require("firebase-admin");

// Load service account from environment variable
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error(
        "FIREBASE_SERVICE_ACCOUNT environment variable is not set.\n" +
        "Please create a .env file and add your Firebase service account credentials.\n" +
        "See .env.example for reference."
    );
}

let serviceAccount;
try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} catch (error) {
    throw new Error(
        "Failed to parse FIREBASE_SERVICE_ACCOUNT. Make sure it's valid JSON.\n" +
        "Error: " + error.message
    );
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "jsprep-ed0c8.appspot.com"
});

module.exports = admin;