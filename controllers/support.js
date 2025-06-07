const { FieldValue } = require('firebase-admin/firestore');
const admin = require('../firebaseConfig');
const { handleFailError } = require('../utils/handleError');
const { handleValidations } = require('../utils/handleValidation');
const db = admin.firestore();


exports.addSupport = async (req, res) => {
    try {
        const { id, customerName, customerEmail, tableNumber, problemType, priority, status, problemDesc } = req.body;
        let errorObj = handleValidations(res, [{ 'id': id }, { 'customerName': customerName }, { 'customerEmail': customerEmail }, { 'tableNumber': tableNumber }, { 'problemType': problemType }, { 'priority': priority }, { 'status': status }, { 'problemDesc': problemDesc }]);
        if (Object.keys(errorObj).length > 0) {
            res.status(400).json({
                message: errorObj?.message,
                detail: errorObj?.detail
            })
            return;
        }
        const payload = { id: id, customerName: customerName, customerEmail: customerEmail, tableNumber: tableNumber, problemType: problemType, priority: priority, status: status, problemDesc: problemDesc, createdAt: FieldValue.serverTimestamp() }
        const docRef = db.collection('support').doc(id);
        await docRef.set(payload);
        res.status(201).json({
            success: true,
            message: 'Support Added Successfully'
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.updateSupport = async (req, res) => {
    try {
        const { id, customerName, customerEmail, tableNumber, problemType, priority, status, problemDesc } = req.body;
        let errorObj = handleValidations(res, [{ 'id': id }, { 'customerName': customerName }, { 'customerEmail': customerEmail }, { 'tableNumber': tableNumber }, { 'problemType': problemType }, { 'priority': priority }, { 'status': status }, { 'problemDesc': problemDesc }]);
        if (Object.keys(errorObj).length > 0) {
            res.status(400).json({
                message: errorObj?.message,
                detail: errorObj?.detail
            })
            return;
        }
        let supportRef = await db.collection('support').where('id', '==', id).get();
        if (supportRef.empty) {
            res.status(404).json({
                message: 'No data found',
                detail: `No data found for ${id}`
            })
            return;
        }
        supportRef.forEach(doc => {
            let docData = doc.data();
            let updateData = { ...docData, customerName: customerName, customerEmail: customerEmail, tableNumber: tableNumber, problemType: problemType, priority: priority, status: status, problemDesc: problemDesc, updatedAt: FieldValue.serverTimestamp() }
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

exports.deleteSupport = async (req, res) => {
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
        let supportRef = await db.collection('support').where('id', '==', id).get();
        if (supportRef.empty) {
            res.status(404).json({
                message: 'No data found',
                detail: `No data found for ${id}`
            })
            return;
        }
        const deleteQuery = db.collection('support').where('id', '==', id);
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

exports.getSupport = async (req, res) => {
    try {
        const supportListRef = db.collection('support');
        const snapshot = await supportListRef.get();
        if (snapshot.empty) {
            res.status(404).json({
                message: 'No support found',
                detail: "No support found"
            })
            return;
        }
        const supportList = [];
        snapshot.forEach(doc => {
            supportList.push(doc.data())
        });
        res.status(200).json({
            success: true,
            supportList
        })
    } catch (error) {
        handleFailError(res, error);
    }
}