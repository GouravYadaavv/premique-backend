const { createProduct, updateProduct, deleteProduct, getProducts, getProductById, blacklistedProduct, removeFromBlacklist } = require("../controllers/productController");
const upload = require("../middlewares/multer");
const verifyToken = require("../middlewares/verifyToken")
const router = require("express").Router();


router.post("/create-product", verifyToken, upload.array("images", 4), createProduct);

router.put("/update-product/:id", verifyToken, updateProduct);

router.delete("/delete-product/:id", verifyToken, deleteProduct);

router.get("/get-products" , getProducts);

router.get("/get-product-by-id/:productId", getProductById);

router.put("/blacklist-product/:id", verifyToken, blacklistedProduct );

router.put("/remove-from-blacklist/:id", verifyToken, removeFromBlacklist)
module.exports = router;