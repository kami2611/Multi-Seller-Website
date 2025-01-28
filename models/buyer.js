const mongoose = require('mongoose');
const Buyer = new mongoose.Schema({
    name:
    {
        type: String,
        required: true
    },
    shopName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true
    },
    products:[{
        type: mongoose.Types.ObjectId,
        ref:'Product'
    }],
    createdAt: { type: Date, default: Date.now },
});

module.exports=mongoose.model('Buyer', Buyer);
