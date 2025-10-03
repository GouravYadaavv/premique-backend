const { signup, adminLogin, adminSignup, login } = require("../controllers/authController");


const router = require("express").Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/admin-signup", adminSignup)

router.post("/admin-login", adminLogin)

module.exports = router;