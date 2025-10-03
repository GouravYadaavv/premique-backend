const User = require("../models/User");
const Admin = require("../models/Admin");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user)
      return res.status(400).json({
        success: false,
        message: "please try again with another email",
      });

    //hassed password
    const hasshedPassword = await bcrypt.hash(password, 10);

    user = new User({
      name,
      email,
      phone,
      password: hasshedPassword,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "user create successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  const { id, name, phone, otp } = req.body;

  try {
     let user = await User.findOne({ phone });
     

       if (user) {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET
      );

        const updatedUser = await User.findByIdAndUpdate(
          user._id,
          { otp, name }, // options
           { new: true } 
        );

       return res.status(200).json({
         success: true,
         message: "Already Login",
         token,
         user: {
           id: user._id,
           name: updatedUser.name,
           otp: user.otp,
           phone: user.phone,
           role: user.role,
         },
       });
      }

      user = new User({
      name,
      otp,
      phone,
    });

    await user.save();
   

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      success: true,
      message: "User loged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        otp: user.otp,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const adminSignup = async (req, res) => {
  // const { username, password } = req.body;

  // try {
  //   let admin = await Admin.findOne({ username });
  //   if (admin)
  //     return res
  //       .status(400)
  //       .json({
  //         success: false,
  //         message: "Please try again with different username",
  //       });
  //   const securePassword = await bcrypt.hash(password, 10);

  //   admin = new Admin({
  //     username,
  //     password: securePassword,
  //   });
  //   await admin.save();

  //   return res
  //     .status(201)
  //     .json({ success: true, message: "Admin signup successfully" });
  // } catch (error) {
  //   return res.status(500).json({ success: false, message: error.message });
  // }
};

const adminLogin = async (req, res) => {
  const { username, password } = req.body;


  try {
    let admin = await Admin.findOne({ username });
    if (!admin)
      return res
        .status(404)
        .json({
          success: false,
          message: "please try again with different username",
        });

    const comparePassword = await bcrypt.compare(password, admin.password);

    if (!comparePassword)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      // {
      //   expiresIn: "1d",
      // }
    );

    return res
      .status(200)
      .json({
        success: true,
        message: "admin logged in",
        token,
        user: { id: admin._id, username: admin.username, role: admin.role },
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { signup, login, adminSignup, adminLogin };
