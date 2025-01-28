const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: true,
        unique: true,
    },
    name:
    {
        type: String,
        required: true
    },
    storeName:{
        type: String,
    },
    email:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum:['seller', 'buyer'],
        default: 'buyer',
    },
    products:[{
        type: mongoose.Types.ObjectId,
        ref:'Product'
    }],
    createdAt: {type: Date, default: Date.now },
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);
