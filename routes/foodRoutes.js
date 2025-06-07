const express = require('express');
const { getFoodItems, addFood, updateFood, deleteFood } = require('../controllers/food');
const { isAuthenticatedUser } = require('../middlewares/auth');
const { handleRoles } = require('../middlewares/handleRoles')

const router = express.Router();

router.get("/getFoodItems", getFoodItems);
router.post("/addFood", addFood);
router.post("/updateFood", updateFood);
router.post("/deleteFood", deleteFood);


module.exports = router;