const admin = require('../firebaseConfig');
const { handleFailError } = require('../utils/handleError');
const { handleValidations } = require('../utils/handleValidation');
const db = admin.firestore();
const { FieldValue } = require('firebase-admin/firestore');


exports.addOrder = async (req, res) => {
    try {
        const { id, customerName, customerEmail, tableNumber, totalAmount, status, items } = req.body;
        let errorObj = handleValidations(res, [{ 'id': id }, { 'customerName': customerName }, { 'customerEmail': customerEmail }, { 'tableNumber': tableNumber }, { 'totalAmount': totalAmount }, { 'status': status }, { 'items': items }]);
        if (Object.keys(errorObj).length > 0) {
            res.status(400).json({
                message: errorObj?.message,
                detail: errorObj?.detail
            })
            return;
        }
        const payload = { id: id, customerName: customerName, customerEmail: customerEmail, tableNumber: tableNumber, totalAmount: totalAmount, status: status, items: items, createdAt: FieldValue.serverTimestamp() }
        const docRef = db.collection('orders').doc(id);
        await docRef.set(payload);
        res.status(201).json({
            success: true,
            message: 'Order Added Successfully'
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.getOrders = async (req, res) => {
    try {
        const orderListRef = db.collection('orders');
        const snapshot = await orderListRef.get();
        if (snapshot.empty) {
            res.status(404).json({
                message: 'No support found',
                detail: "No support found"
            })
            return;
        }
        const orderList = [];
        snapshot.forEach(doc => {
            orderList.push(doc.data())
        });
        res.status(200).json({
            success: true,
            orderList
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.editOrder = async (req, res) => {
    try {
        const { id, customerName, customerEmail, tableNumber, totalAmount, status, items } = req.body;
        let errorObj = handleValidations(res, [{ 'id': id }, { 'customerName': customerName }, { 'customerEmail': customerEmail }, { 'tableNumber': tableNumber }, { 'totalAmount': totalAmount }, { 'status': status }, { 'items': items }]);
        if (Object.keys(errorObj).length > 0) {
            res.status(400).json({
                message: errorObj?.message,
                detail: errorObj?.detail
            })
            return;
        }
        let orderRef = await db.collection('orders').where('id', '==', id).get();
        if (orderRef.empty) {
            res.status(404).json({
                message: 'No data found',
                detail: `No data found for ${id}`
            })
            return;
        }
        orderRef.forEach(doc => {
            let docData = doc.data();
            let updateData = { ...docData, customerName: customerName, customerEmail: customerEmail, items: items, tableNumber: tableNumber, totalAmount: totalAmount, status: status, updatedAt: FieldValue.serverTimestamp() }
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

exports.deleteOrder = async (req, res) => {
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
        let OrderRef = await db.collection('orders').where('id', '==', id).get();
        if (OrderRef.empty) {
            res.status(404).json({
                message: 'No data found',
                detail: `No data found for ${id}`
            })
            return;
        }
        const deleteQuery = db.collection('orders').where('id', '==', id);
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
