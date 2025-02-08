const mongoose = require('mongoose');
const Cart = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    items: [{
            type: mongoose.Types.ObjectId,
            ref: 'Product'
            }
    ],
    totalPrice:{
        type:Number
    },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Cart', Cart);
