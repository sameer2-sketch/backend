const { FieldValue } = require('firebase-admin/firestore');
const admin = require('../firebaseConfig');
const { handleFailError } = require('../utils/handleError');
const db = admin.firestore();
const { formidable } = require('formidable');
const uuid = require('uuid-v4');
const { handleValidations } = require('../utils/handleValidation');
const { requestData } = require('../utils/requests');

const bucket = admin.storage().bucket();

exports.getFoodItems = async (req, res) => {
    try {
        const foodListRef = db.collection('foodItems');
        const snapshot = await foodListRef.get();
        if (snapshot.empty) {
            res.status(404).json({
                message: 'No Food found',
                detail: "No Food found"
            })
            return;
        }
        const foodList = [];
        snapshot.forEach(doc => {
            foodList.push(doc.data())
        });
        res.status(200).json({
            success: true,
            foodList
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.addFood = async (req, res) => {
    try {
        const { id, name, description, price, category, image, available, isVegetarian, isFeatured, moods } = req.body;
        let errorObj = handleValidations(res, [{ 'id': id }, { 'name': name }, { 'description': description }, { 'price': price }, { 'category': category }, { 'image': image }, { 'available': available }, { 'isVegetarian': isVegetarian }, { 'isFeatured': isFeatured }, { 'moods': moods }]);
        if (Object.keys(errorObj).length > 0) {
            res.status(400).json({
                message: errorObj?.message,
                detail: errorObj?.detail
            })
            return;
        }
        let questions = await db.collection('foodItems').where('name', '==', name).get();
        if (!questions.empty) {
            res.status(404).json({
                message: 'Duplicate Entry',
                detail: `Dunplicate food found for ${name}`
            })
            return;
        }
        let payload = { id: id, name: name, description: description, price: price, category: category, image: image, available: available, isVegetarian: isVegetarian,isFeatured: isFeatured, moods: moods, createdAt: FieldValue.serverTimestamp() }
        const docRef = db.collection('foodItems').doc(id);
        await docRef.set(payload);
            res.status(201).json({
                success: true,
                message: 'Food Added Successfully'
            })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.updateFood = async (req, res) => {
    try {
        const { id, name, description, price, category, image, available, isVegetarian, isFeatured, moods } = req.body;
        let errorObj = handleValidations(res, [{ 'id': id }, { 'name': name }, { 'description': description }, { 'price': price }, { 'category': category }, { 'image': image }, { 'available': available }, { 'isVegetarian': isVegetarian }, { 'isFeatured': isFeatured }, { 'moods': moods }]);
        if (Object.keys(errorObj).length > 0) {
            res.status(400).json({
                message: errorObj?.message,
                detail: errorObj?.detail
            })
            return;
        }
        let foodRef = await db.collection('foodItems').where('id', '==', id).get();
        if (foodRef.empty) {
            res.status(404).json({
                message: 'No data found',
                detail: `No data found for ${id}`
            })
            return;
        }
        foodRef.forEach(doc => {
            let docData = doc.data();
            let updateData = { ...docData, name, description, price, category, image, available, isVegetarian, isFeatured, moods, updatedAt: FieldValue.serverTimestamp() }
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

exports.deleteFood = async (req, res) => {
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
        let food = await db.collection('foodItems').where('id', '==', id).get();
        if (food.empty) {
            res.status(404).json({
                message: 'No data found',
                detail: `No data found for ${id}`
            })
            return;
        }
        const deleteQuery = db.collection('foodItems').where('id', '==', id);
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