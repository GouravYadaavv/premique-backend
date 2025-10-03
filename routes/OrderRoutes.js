const router = require("express").Router();
const { getOrdersByUserId, getAllOrders, getMatrics, updateOrderStatus, createOrder } = require("../controllers/OrderController");
const verifyToken = require("../middlewares/verifyToken");


router.get("/get-orders-by-user-id", verifyToken, getOrdersByUserId)

router.get("/get-all-orders", verifyToken, getAllOrders);

router.get("/get-metrics", verifyToken, getMatrics);

router.put("/update-order-status/:id", verifyToken, updateOrderStatus);

router.post("/create-order" ,verifyToken, createOrder)

module.exports = router;