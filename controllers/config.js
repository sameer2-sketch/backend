const admin = require('../firebaseConfig');
const { handleFailError } = require('../utils/handleError');
const db = admin.firestore();

exports.createOrder = async (req, res) => {
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