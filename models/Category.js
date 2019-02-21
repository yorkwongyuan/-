const mongoose = require("mongoose");
const categorySchema = require("../schemas/category");
module.exports = mongoose.model('category', categorySchema);
