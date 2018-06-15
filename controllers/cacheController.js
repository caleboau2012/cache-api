/**
 * Created by KayLee on 15/06/2018.
 */
var Cache = require('../models/Cache');
var loremIpsum = require('lorem-ipsum');

// Display all keys in cache.
exports.getAll = function(req, res) {
    Cache.find().select('key -_id').exec(function(err, data){
        if(err)
            res.send(500, err.message);
        else {
            var response = {
                data : []
            };
            data.forEach(function(element){
                response.data.push(element.key);
            });

            res.send(response);
        }
    });
};

// Get Data for a give key
exports.getData = function(req, res){
    var key = req.params.key;

    Cache.findOne({"key": key}).exec(function(err, cache){
        console.log(cache);
        if(err)
            res.send(500, err.message);
        else{
            var response = {};
            if(cache == null){
                response.message = "Cache Miss";
                response.data = loremIpsum();
                Cache.create({
                    key: key,
                    data: response.data
                }, function(err, cache){
                    if(err)
                        res.send(500, err.message);
                    else{
                        console.log(cache);
                        res.send(response);
                    }
                });
            }
            else{
                response.message = "Cache Hit";
                response.data = cache.data;
                res.send(response);
            }
        }
    });
};

// Create or Update Data
exports.setData = function(req, res){
    res.send("To be completed")
};

// Delete all data
exports.deleteAll = function(req, res){
    res.send("To be completed")
};

// Delete specific cache data
exports.deleteData = function(req, res){
    res.send("To be completed")
};