const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
    Categorys: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    },
    // 标题
    title: String,

    // 简介
    description: {
        type: String,
        default: ""
    },

    // 内容
    content: {
        type: String,
        default: ""
    },
    addTime:{
        type: Date,
        default: new Date()
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    views: {
        type: Number,
        default: 0
    },
    comments: {
        type: Array,
        default: []
    }
});

module.exports = contentSchema;