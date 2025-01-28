const mongoose = require('mongoose');
const Product = new mongoose.Schema({
    name:
    {
        type: String,
        required: true
    },
    price:{
        type: Number,
    },
    frameType:
    {
        type: String,
    },
    weight:
    {
        type: Number,
    },
    handleSize:{
        type: String,
        enum:['4U', '3U', '2U'],
    },
    maxTension:{
        type: Number,
    },
    owner:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    createdAt: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Product', Product);
