const express = require('express');
const { addOrder, getOrders, editOrder, deleteOrder, cancelOrder, handlePayment, checkPayment } = require('../controllers/orders');
const { isAuthenticatedUser } = require('../middlewares/auth');
const { handleRoles } = require('../middlewares/handleRoles');


const router = express.Router();

router.post("/addOrder", addOrder);
router.post("/handle-payment", handlePayment);
router.get("/getOrders", getOrders);
router.get("/check-payment/:linkId", checkPayment);
router.post("/editOrder", editOrder);
router.post("/deleteOrder", deleteOrder);
router.post("/cancelOrder", cancelOrder);



module.exports = router;

