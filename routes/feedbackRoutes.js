const express = require('express');
const { isAuthenticatedUser } = require('../middlewares/auth');
const { addFeedback, updateFeedback, deleteFeedback, getFeedback } = require('../controllers/feedback');

const router = express.Router();

router.post("/addFeedback", addFeedback);
router.get("/getFeedbacks", getFeedback);
router.post("/updateFeedback", updateFeedback);
router.post("/deleteFeedback", deleteFeedback);


module.exports = router;