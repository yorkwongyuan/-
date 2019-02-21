
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema({
    username: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = blogSchema;


