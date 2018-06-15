/**
 * Created by KayLee on 15/06/2018.
 */
var mongoose = require('mongoose');
var expiryPeriod = 1; // expiry period in days

//Define a schema
var Schema = mongoose.Schema;

var CacheSchema = new Schema({
    key: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    },
    TTL: {
        type: Date,
        default: function(){
            return Date.now() + (expiryPeriod * 86400); // 86400 seconds in a day
        }
    }
});

module.exports = mongoose.model('Cache', CacheSchema);