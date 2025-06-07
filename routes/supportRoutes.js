const express = require('express');
const { isAuthenticatedUser } = require('../middlewares/auth');
const { addSupport, getSupport, updateSupport, deleteSupport } = require('../controllers/support');

const router = express.Router();

router.post("/addSupport", addSupport);
router.get("/getSupport", getSupport);
router.post("/updateSupport", updateSupport);
router.post("/deleteSupport", deleteSupport);


module.exports = router;