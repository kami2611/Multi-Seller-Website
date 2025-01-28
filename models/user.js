const mongoose = require('mongoose');
const User = new mongoose.Schema({
    name:
    {
        type: String,
        required: true
    },
    shopName:{
        type: String,
        default: '',
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
    createdAt: { type: Date, default: Date.now },
});

module.exports=mongoose.model('User', User);
