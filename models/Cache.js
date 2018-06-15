/**
 * Created by KayLee on 15/06/2018.
 */
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var CacheSchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    data: {
        type: String,
        required: true
    },
    TTL: {
        type: Date,
        default: function(){
            return Date.now() + (process.env.expiry_period * 86400000); // 86400 seconds in a day
        }
    }
});

module.exports = mongoose.model('Cache', CacheSchema);