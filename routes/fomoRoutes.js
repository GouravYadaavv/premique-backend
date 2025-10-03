const {  getLiveVisitors, getViewers, getPopup } = require("../controllers/fomoController");

const router = require("express").Router();

router.get("/live-visitors", getLiveVisitors);
router.get("/product-viewers/:productId", getViewers);
router.get("/popup", getPopup)


module.exports = router;