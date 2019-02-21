const mongoose = require("mongoose");

const Content = require("../schemas/content");

module.exports = mongoose.model("Content", Content);