"use strict"
const mongoose  = require('mongoose'),
      Schema    = mongoose.Schema;
let UserSchema = new Schema({
    first_name           : {type: String,  required: true},
    last_name            : {type: String, required: true},
    email                : {type: String, required: true },                       
    password             : {type: String, required: true},
    status               : {type: Boolean, required: true, default: 1},  
    active               : {type: Boolean, required: true, default: 1}
},{ timestamps : true });

// Export the model
module.exports = mongoose.model('User', UserSchema);

