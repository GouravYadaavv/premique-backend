const router = require("express").Router();
const { createReview, updateReview, deleteReview, getReviews, replyReview } = require("../controllers/ReviewController");
const verifyToken = require("../middlewares/verifyToken");


router.post("/create-review", verifyToken, createReview);

router.put("/update-review/:id", verifyToken, updateReview);

router.delete("/delete-review/:id", verifyToken, deleteReview);

router.get("/get-review/:id", getReviews);

router.put("/reply-review/:id", verifyToken, replyReview);

module.exports = router;