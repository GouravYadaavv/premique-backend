const { ROLES } = require("../utils/constants");
const Admin = require("../models/Admin");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Username change karne wala controller
const changeUsername = async (req, res) => {
  // agar current user ka role "admin" nahi hai toh access deny kar dena
  if (req.role !== ROLES.admin) {
    return res.status(401).json({ message: "Access Denied" });
  }

  try {
    // request body se dono usernames le rahe hain
    const { previousUsername, newUsername } = req.body;

    // agar newUsername nahi diya gaya hai toh error bhejna
    if (!newUsername) {
      return res.status(400).json({
        success: false,
        message: "Username is changed to required", // yaha shayad likhna tha: "New username is required"
      });
    }

    // database me search kar ke username update karna
    // findOneAndUpdate:
    // pehle object = filter (kis record ko dhundhna hai)
    // dusra object = update data (kya change karna hai)
    // teesra = options (yaha "new:true" ka matlab hai updated document return kare)
    const admin = await Admin.findOneAndUpdate(
      { username: previousUsername }, // jiska old username hai usko dhundo
      { username: newUsername }, // uska username change karo
      { new: true } // updated document wapas milega
    );

    // agar koi admin record nahi mila toh error bhejna
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Username does not exist",
      });
    }

    // agar successfully update ho gaya toh success response bhejna
    return res.status(200).json({
      success: true,
      message: `New username is ${admin.username}`, // updated username show karna
      user: {
        username: admin.username, // admin ka new username
        role: admin.role, // admin ka role
      },
    });
  } catch (error) {

    // agar koi error aaya toh server error bhejna
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
      if (req.role !== ROLES.admin) {
            return res.status(401).json({ message: "Access Denied" });
      }

      try {
            const { username, previousUsername, newUsername } = req.body;

            if(!previousPassword || !newPassword) {
                return res.status(400).json({success:false, message:"Previous and new password is required"})
            }

            let user = await Admin.findOne({ username });

            if(!user) {
                return res.status(404).json({success:false, message: "User not found" })
            }

            const isPasswordValid = await bcrypt.compare(previousPassword, user.password);

            if(!isPasswordValid){
                return res.status(400).json({
                    success:false, message:"previous password is wrong"
                })
            };

            const securePassword = await bcrypt.hash(newPassword, 10);

            user.password = securePassword;
            await user.save();

            return res.status(200).json({
                success:true, message:"Password change successfully"
            });
        
      } catch (error) {
         return res.status(500).json({
      success: false,
      message: error.message,
      });
    }

}

module.exports ={changeUsername, changePassword};
