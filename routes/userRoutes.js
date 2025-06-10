const express = require('express');

const { register, login, getUserDetails, updateUserDetails, deleteUser } = require('../controllers/user');
const { isAuthenticatedUser } = require('../middlewares/auth');

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;