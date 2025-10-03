const {  CountBuyNowButtonClick, pageView, getAllAnalytics, getAnalyticsSummary, getAnalyticsByProduct } = require("../controllers/analyticsController");
const verifyToken = require("../middlewares/verifyToken");

const router = require("express").Router();

// router.post("/track", track);

router.post("/analytics/buy-now", CountBuyNowButtonClick)

router.post("/analytics/page-view", pageView);

router.get("/analytics", getAllAnalytics); // ✅ All events
router.get("/analytics/summary", getAnalyticsSummary); // ✅ Summary by eventType
router.get("/analytics/product/:productId", getAnalyticsByProduct); // ✅ Events of single product

module.exports = router;
