const jwt = require("jsonwebtoken"); // JWT library import kar rahe hai

// Middleware function verifyToken
const verifyToken = (req, res, next) => {
  // "authorization" header nikal rahe hai (jo mostly format me hota hai: Bearer <token>)
  const authHeader = req.headers["authorization"];

  // Token ko 2 jagah se check kar rahe hai:
  // 1. Cookies se (req.cookies?.token)
  // 2. Authorization header se (Bearer token format)
  const token = req.cookies?.token || (authHeader && authHeader.split(" ")[1]);

  // Agar token hi nahi mila toh unauthorized error bhej do
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized request", // Matlab user ne login token nahi bheja
    });
  }

  try {
    // JWT verify kar rahe hai, secret key se match hoga
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        // Agar token galat hai ya expire ho gaya hai
        return res
          .status(401)
          .json({ success: false, message: "Invalid Token" });
      }

      // Agar token sahi hai toh uske andar ka user data req object me daal rahe hai
      req.id = user.id; // user ka ID store
      req.role = user.role; // user ka role store (jaise admin ya normal user)
      req.phone = user.phone;

      // Next middleware ya controller call karo
      next();
    });
  } catch (error) {
    // Agar JWT verify karte time koi error aa jaye (server side)
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Middleware export kar diya taaki routes me use kar sake
module.exports = verifyToken;
