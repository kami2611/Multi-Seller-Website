const mongoose = require('mongoose');
const Product = new mongoose.Schema({
    name:
    {
        type: String,
        required: true
    },
    frameType:
    {
        type: String,
    },
    Orignal:{
        type: Boolean,
    },
    weight:
    {
        type: Number,
    },
    handleSize:{
        type: String,
    },
    maxTension:{
        type: Number,
    },
    createdAt: { type: Date, default: Date.now}
});

module.exports=mongoose.model('Product', Product);
