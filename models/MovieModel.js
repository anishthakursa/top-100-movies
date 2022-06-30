"use strict"
const mongoose  = require('mongoose'),
      Schema    = mongoose.Schema;
let MovieSchema = new Schema({
    name                 : {type: String,  required: true},
    image                : [{ type: String, required: true }], 
    video                : [{ type: String, required: false }], 
    description          : {type: String, required: true },   
    year                 : { type: Number, required: true },
    status               : {type: Boolean, required: true, default: 1}
},{ timestamps : true });

// Export the model
module.exports = mongoose.model('Movie', MovieSchema);