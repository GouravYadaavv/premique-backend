const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
    review : {
        type : String,
        required : true,
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
},
 { timestamps : true }
)

const reviewSchema = new mongoose.Schema({
    productId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product",
        required : true,
    },
    review:{
        type :String,
        required :true,
    },
    rating : {
        type :Number,
        required : true,
        min :1,
        max:5,
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    replies : [replySchema],
},
{timestamps : true}
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;