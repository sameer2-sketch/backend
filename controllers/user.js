const admin = require('../firebaseConfig');
const SCOPES = ['https://www.googleapis.com/auth/cloud-platform'];
const { handleUserSignUpErrors, handleUserLoginErrors } = require('../utils/handleAuthErrors');
const { handleFailError } = require('../utils/handleError');
const { setToken } = require('../utils/authToken');
const { handleRegisterValidation } = require('../utils/handleValidation');
const db = admin.firestore();
const auth = admin.auth();
db.settings({ ignoreUndefinedProperties: true })

exports.register = async (req, res) => {
    const { phoneNumber, name, password, idToken, refreshToken, email, code } = req.body;
    const userData = { phoneNumber, name, email, password };
    if(!name) {
        handleRegisterValidation(res, name, 'Missing mandatory field', "Please enter Name", 400);
        return;
    }
    if(!phoneNumber) {
        handleRegisterValidation(res, phoneNumber, 'Missing mandatory field', "Please enter Phone Number", 400);
        return;
    }
    if(!password) {
        handleRegisterValidation(res, confirmPassword, 'Missing mandatory field', "Please enter password", 400);
        return;
    }
    if(!email) {
        handleRegisterValidation(res, email, 'Missing mandatory field', "Please enter email", 400);
        return;
    }
    auth.verifyIdToken(idToken).then(async (decodedToken) => {
        if (decodedToken?.uid) {
            const setUserData = { ...userData, uid: decodedToken?.uid, email: decodedToken?.email }
            const docRef = db.collection('users').doc(decodedToken?.uid);
            await docRef.set(setUserData);
            setToken(201, idToken, refreshToken, res, userData);
        }
    }).catch(error => {
        handleFailError(res, error)
    })
}

exports.login = async (req, res) => {
    const { idToken, refreshToken } = req.body;
    auth.verifyIdToken(idToken).then(async (decodedToken) => {
        if (decodedToken?.uid) {
            let userData;
            const usersRef = db.collection('users');
            const snapshot = await usersRef.where('uid', '==', decodedToken?.uid).get();
            snapshot.forEach((doc) => {
              userData = doc.data();
            });
            setToken(201, idToken, refreshToken, res, userData);
        }
    }).catch(error => {
        handleFailError(res, error)
    })
}

exports.getUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        const userRef = db.collection('users');
        const snapshot = await userRef.where('uid', '==', userId).get();
        if (snapshot.empty) {
            res.status(404).json({
                message: 'No user found',
                detail: "No user found for the given id"
            })
            return;
        }
        const userDetails = {}; 
        snapshot.forEach(doc => {
            Object.assign(userDetails, doc.data());
        });
        res.status(200).json({
            success: true,
            userInfo: userDetails
        })
    } catch (error) {
        handleFailError(res, error);
    }
}