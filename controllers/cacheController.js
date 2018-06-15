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
    Cache.findOne({"key": req.params.key}).exec(function(err, cache){
        console.log(cache);
        if(err)
            res.send(500, err.message);
        else{
            var response = {};
            if(cache == null){
                response.message = "Cache Miss";
                response.data = loremIpsum();
                Cache.create({
                    key: req.params.key,
                    data: response.data
                }, function(err, cache){
                    if(err)
                        res.send(500, err.message);
                    else{
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
    var cache = {
        key: req.params.key,
        data: req.body.data
    };
    Cache.update({key: req.params.key}, cache, {upsert: true, setDefaultsOnInsert: true}, function(err){
        if(err)
            res.send(500, err.message);
        else{
            var response = {
                message: "Operation successful",
                data: cache.data
            };
            res.send(response);
        }
    });
};

// Delete all data
exports.deleteAll = function(req, res){
    Cache.remove({}, function(err){
        if(err)
            res.send(500, err.message);
        else{
            res.send({message: "All items deleted"});
        }
    })
};

// Delete specific cache data
exports.deleteData = function(req, res){
    Cache.findOne({"key": req.params.key}).exec(function(err, cache){
        if(err)
            res.send(500, err.message);
        else {
            if(cache == null){
                res.send(404, "No cache items found with this key");
            }
            else{
                cache.remove(function(er){
                    if(er)
                        res.send(500, er.message);
                    else
                        res.send({message: "Delete operation successful"});
                })
            }
        }
    })
};