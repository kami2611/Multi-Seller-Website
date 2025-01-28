const mongoose = require('mongoose');
const Order = new mongoose.Schema({
    buyer:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true,
    },
    seller:
    {
        type: mongoose.Types.ObjectId,
        ref:'User',
        required:true,
    },
    status:{
        type: String,
        enum:['pending','shipped', 'delivered', 'canceled'],
    },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Order', Order);
