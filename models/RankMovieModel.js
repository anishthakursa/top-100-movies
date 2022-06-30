"use strict"
const mongoose  = require('mongoose'),
      Schema    = mongoose.Schema;
let RankMovieSchema = new Schema({
    movie_id         : { type: Schema.Types.ObjectId, ref: 'Movie' },
    user_id          : {type: String, required: true },   
    rank             : { type: Number, required: true }
},{ timestamps : true });

// Export the model
module.exports = mongoose.model('RankMovie', RankMovieSchema);