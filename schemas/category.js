let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: String
});

module.exports = categorySchema;