const express = require('express');
const { isAuthenticatedUser } = require('../middlewares/auth');
const { createOrder } = require('../controllers/config');

const router = express.Router();

router.get("/create-order", createOrder);


module.exports = router;