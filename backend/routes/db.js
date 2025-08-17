const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
    email : { type : String, unique : true },
    password : String,
    firstName : String,
    lastName : String
});

const adminSchema = new Schema({
    email : { type : String, unique : true },
    password : String,
    firstName : String,
    lastName : String
});

const contentSchema = new Schema({
    title : String,
    description : String,
    price : Number,
    imageUrl : String,
    createrId : ObjectId
});

const purchaseSchema = new Schema({
    userId : ObjectId,
    contentId : ObjectId  
});

const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const contentModel = mongoose.model("content", contentSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);

module.exports = {
    userModel,
    adminModel,
    contentModel,
    purchaseModel
};