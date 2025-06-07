const express = require('express');

const { register, login, getUserDetails, updateUserDetails, deleteUser, getFavoriteTopics, googleLogin, checkUser, googleRegister, genAIChat } = require('../controllers/user');
const { isAuthenticatedUser } = require('../middlewares/auth');



const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/delete/:userId", deleteUser);
router.get("/:userId", getUserDetails);
router.post("/:userId", updateUserDetails);

module.exports = router;