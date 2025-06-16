const { FieldValue } = require('firebase-admin/firestore');
const admin = require('../firebaseConfig');
const { handleFailError } = require('../utils/handleError');
const { handleValidations } = require('../utils/handleValidation');
const db = admin.firestore();


exports.addFeedback = async (req, res) => {
    try {
        const { id, customerName, customerEmail, orderNumber, rating, category, description, wouldRecommend, suggestions, status } = req.body;
        let errorObj = handleValidations(res, [{ 'id': id }, { 'customerName': customerName }, { 'customerEmail': customerEmail }, { 'rating': rating }, { 'category': category }, { 'description': description }, { 'wouldRecommend': wouldRecommend }]);
        if (Object.keys(errorObj).length > 0) {
            res.status(400).json({
                message: errorObj?.message,
                detail: errorObj?.detail
            })
            return;
        }
        const payload = { id: id, customerName: customerName, customerEmail: customerEmail, orderNumber: orderNumber, rating: rating, category: category, description: description, wouldRecommend: wouldRecommend, suggestions: suggestions, status: 'new', createdAt: FieldValue.serverTimestamp() }
        const docRef = db.collection('feedback').doc(id);
        await docRef.set(payload);
        res.status(201).json({
            success: true,
            message: 'Feedback Added Successfully'
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.updateFeedback = async (req, res) => {
    try {
        const { id, customerName, customerEmail, orderNumber, rating, category, description, wouldRecommend, suggestions, status } = req.body;
        let errorObj = handleValidations(res, [{ 'id': id }, { 'customerName': customerName }, { 'customerEmail': customerEmail }, { 'rating': rating }, { 'category': category }, { 'description': description }, { 'wouldRecommend': wouldRecommend }]);
        if (Object.keys(errorObj).length > 0) {
            res.status(400).json({
                message: errorObj?.message,
                detail: errorObj?.detail
            })
            return;
        }
        let supportRef = await db.collection('feedback').where('id', '==', id).get();
        if (supportRef.empty) {
            res.status(404).json({
                message: 'No data found',
                detail: `No data found for ${id}`
            })
            return;
        }
        supportRef.forEach(doc => {
            let docData = doc.data();
            let updateData = { ...docData, customerName: customerName, customerEmail: customerEmail, orderNumber: orderNumber, rating: rating, category: category, description: description, wouldRecommend: wouldRecommend, suggestions: suggestions, status: status, updatedAt: FieldValue.serverTimestamp() }
            doc.ref.update(updateData);
        });
        res.status(201).json({
            success: true,
            message: 'Updated Successfully'
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.deleteFeedback = async (req, res) => {
    try {
        const { id } = req.body;
        let errorObj = handleValidations(res, [{ 'id': id }]);
        if (Object.keys(errorObj).length > 0) {
            res.status(400).json({
                message: errorObj?.message,
                detail: errorObj?.detail
            })
            return;
        }
        let feedbackRef = await db.collection('feedback').where('id', '==', id).get();
        if (feedbackRef.empty) {
            res.status(404).json({
                message: 'No data found',
                detail: `No data found for ${id}`
            })
            return;
        }
        const deleteQuery = db.collection('feedback').where('id', '==', id);
        deleteQuery.get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                doc.ref.delete();
            })
            res.status(201).json({
                message: 'Deleted Successfully',
                detail: `Deleted successfully`
            })
        }).catch(err => {
            res.status(500).json({
                message: 'Something went wrong. Please try again later',
                detail: `${err}`
            })
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.getFeedback = async (req, res) => {
    try {
        const feedbackListRef = db.collection('feedback');
        const snapshot = await feedbackListRef.get();
        if (snapshot.empty) {
            res.status(404).json({
                message: 'No support found',
                detail: "No support found"
            })
            return;
        }
        const feedbackList = [];
        snapshot.forEach(doc => {
            feedbackList.push(doc.data())
        });
        res.status(200).json({
            success: true,
            feedbackList
        })
    } catch (error) {
        handleFailError(res, error);
    }
}