const admin = require('../firebaseConfig');
const { handleFailError } = require('../utils/handleError');
const { handleValidations } = require('../utils/handleValidation');
const db = admin.firestore();
const { FieldValue } = require('firebase-admin/firestore');
const axios = require('axios');

exports.handlePayment = async (req, res) => {
    try {
        const { id, customerName, customerEmail, totalAmount, customerPhoneNumber, from } = req.body;
        let errorObj = handleValidations(res, [{ 'customerName': customerName }, { 'customerEmail': customerEmail }, { 'totalAmount': totalAmount }, { 'customerPhoneNumber': customerPhoneNumber }]);
        if (Object.keys(errorObj).length > 0) {
            res.status(400).json({
                message: errorObj?.message,
                detail: errorObj?.detail
            })
            return;
        }
        let phoneNumber = '+91' + customerPhoneNumber;
        const returnUrl = from === 'admin' ? `https://admin-hni6.vercel.app/orders/${id}` : `https://craxy-corner.vercel.app/cart/${id}`;
        const response = await axios.post('https://sandbox.cashfree.com/pg/links', {
            customer_details: {
                customer_id: id,
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: phoneNumber,
            },
            link_notify: {
                send_sms: true,
                send_email: true
            },
            link_meta: {
                return_url: returnUrl
            },
            link_id: id,
            link_amount: totalAmount,
            link_currency: "INR",
            link_purpose: `Payment for Order ${id}\nThank You!`
        }, {
            headers: {
                "Content-Type": "application/json",
                "x-client-id": "TEST106672356369ba7ec1c54d608ba853276601",
                "x-client-secret": "cfsk_ma_test_e96b599933e5d183590fc141842803d2_c48abe8b",
                "x-api-version": "2025-01-01"
            }
        })

        if (response?.data) {
            res.status(201).json({
                success: true,
                data: response?.data
            })
        } else {
            res.status(500).json({
                message: 'Something went wrong. Please try again later',
                detail: 'Something went wrong. Please try again later'
            })
        }
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.checkPayment = async (req, res) => {
    try {
        const { linkId } = req.params;
        const response = await axios.get(`https://sandbox.cashfree.com/pg/links/${linkId}`, {
            headers: {
                "Content-Type": "application/json",
                "x-client-id": "TEST106672356369ba7ec1c54d608ba853276601",
                "x-client-secret": "cfsk_ma_test_e96b599933e5d183590fc141842803d2_c48abe8b",
                "x-api-version": "2025-01-01"
            }
        })
        const paymentStatus = response.data.link_status;
        res.status(200).json({
            success: true,
            paymentStatus: paymentStatus
        })
    } catch (err) {
        res.status(500).json({
            message: 'Something went wrong. Please try again later',
            detail: 'Something went wrong. Please try again later'
        })
    }
}

exports.addOrder = async (req, res) => {
    try {
        const { id, customerName, customerEmail, tableNumber, totalAmount, status, items, customerPhoneNumber, from } = req.body;
        let phoneNumber = '+91' + customerPhoneNumber;
        let errorObj = handleValidations(res, [{ 'id': id }, { 'customerName': customerName }, { 'customerEmail': customerEmail }, { 'tableNumber': tableNumber }, { 'totalAmount': totalAmount }, { 'status': status }, { 'items': items }, { 'customerPhoneNumber': customerPhoneNumber }]);
        if (Object.keys(errorObj).length > 0) {
            res.status(400).json({
                message: errorObj?.message,
                detail: errorObj?.detail
            })
            return;
        }
        const payload = { id: id, customerName: customerName, customerEmail: customerEmail, tableNumber: tableNumber, totalAmount: totalAmount, status: status, customerPhoneNumber: phoneNumber, items: items, createdAt: FieldValue.serverTimestamp() }
        const docRef = db.collection('orders').doc(id);
        await docRef.set(payload);
        res.status(201).json({
            success: true,
            message: 'Order Added Successfully',
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
        const { id, customerName, customerEmail, tableNumber, totalAmount, status, items, customerPhoneNumber } = req.body;
        let phoneNumber = '+91' + customerPhoneNumber;
        let errorObj = handleValidations(res, [{ 'id': id }, { 'customerName': customerName }, { 'customerEmail': customerEmail }, { 'tableNumber': tableNumber }, { 'totalAmount': totalAmount }, { 'status': status }, { 'items': items }, , { 'customerPhoneNumber': customerPhoneNumber }]);
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
            let updateData = { ...docData, customerName: customerName, customerEmail: customerEmail, items: items, tableNumber: tableNumber, totalAmount: totalAmount, status: status, customerPhoneNumber: phoneNumber, updatedAt: FieldValue.serverTimestamp() }
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

exports.cancelOrder = async (req, res) => {
    try {
        const { id, reason } = req.body;
        let errorObj = handleValidations(res, [{ 'id': id }]);
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
            let updateData = { ...docData, status: 'cancelled', reason: reason, updatedAt: FieldValue.serverTimestamp() }
            doc.ref.update(updateData);
        });
        res.status(201).json({
            success: true,
            message: 'Cancelled Successfully'
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
