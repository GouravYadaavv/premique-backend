// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//     amount : {
//         type :Number,
//         required :true,
//     },
//     address : {
//         type :String,
//         required :true,
//     },
//     razorpayOrderId:{
//         type : String,
//         required : true,
//     },
//     razorpayPaymentId : {
//         type:String,
//         required :true,
//     },
//     razorPaySignature : {
//         type : String,
//         required : true,
//     },
//     products : [
//         {
//             id : {
//                 type : mongoose.Schema.Types.ObjectId,
//                 ref : "Product",
//             },
//             quantity : {
//                 type : Number,
//                 required : true, 
//             },
//             color : {
//                 type : String,
//             },
//         },
//     ],
//     userId : {
//         type : mongoose.Schema.Types.ObjectId,
//         ref : "User",
//     },
//     status :{
//         type: String,
//         enum : ["pending", "packed" , "in transit" , "completed", "failed"],
//         default : "pending",
//     },
// },  {timestamps :true}
// );

// const Order = mongoose.model("Order", orderSchema);

// module.exports = Order;


const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    phone: {
      // Mobile number from verification step
      type: String,
      // required:true,
    },
    address: {
      state: { type: String, required: true },
      street: { type: String, required: true },
      landmark: { type: String },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
    },

    products: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
        },
        color: {
          type: String,
        },
        size: {
          // ✅ Add this
          type: String,
        },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "packed", "in transit", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
