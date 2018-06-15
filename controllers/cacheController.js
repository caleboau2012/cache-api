/**
 * Created by KayLee on 15/06/2018.
 */
var Cache = require('../models/Cache');
var loremIpsum = require('lorem-ipsum');

/**
 * Display all keys in cache.
 * @param req
 * @param res
 */
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

/**
 * Display data for a particular key. If the key doesn't exist generate random string
 * @param req
 * @param res
 */
exports.getData = function(req, res){
    Cache.findOne({"key": req.params.key}).exec(function(err, cache){
        if(err)
            res.send(500, err.message);
        else{
            //console.log(cache.TTL > Date.now(), typeof(cache.TTL), typeof(Date.now()));
            var response = {};
            if(cache == null){
                createCacheItem(res, req.params.key, loremIpsum(), "Cache Miss");
            }
            else if(cache.TTL < Date.now()){
                console.log("Expired", cache.TTL, Date.now());
                cache.data = loremIpsum();
                cache.TTL = Date.now() + (process.env.expiry_period * 86400000);
                cache.save(function(er){
                    if(er)
                        res.send(500, er.message);
                    else{
                        response.message = "Cache Miss";
                        response.data = cache.data;
                        res.send(response);
                    }
                });
            }
            else{
                cache.TTL = Date.now() + (process.env.expiry_period * 86400000);
                cache.save(function(er){
                    if(er)
                        res.send(500, er.message);
                    else{
                        response.message = "Cache Hit";
                        response.data = cache.data;
                        res.send(response);
                    }
                });
            }
        }
    });
};

/** Function to create cache item keeping the limit in mind.
 * If the limit is exceeded, delete the earliest entry in the cache and then save new entry.
 *
 * @param res
 * @param key
 * @param data
 * @param message
 */
function createCacheItem(res, key, data, message){
    Cache.find().sort({"TTL": 1}).exec(function(err, caches){
        if(caches.length >= process.env.max_in_cache){
            caches[0].remove(function(er){
                if(er)
                    res.send(er.message);
                else{
                    createItem(res, key, data, message);
                }
            })
        }
        else{
            createItem(res, key, data, message);
        }
    });
}

/** DRY method for creating cache Item
 *
 * @param res
 * @param key
 * @param data
 * @param message
 */
function createItem(res, key, data, message){
    var response = {};
    response.message = message;
    response.data = data;
    Cache.create({
        key: key,
        data: data
    }, function(error){
        if(error)
            res.send(500, error.message);
        else{
            res.send(response);
        }
    });
}

// Create or Update Data
/**
 *  Create or update data given a key. But before you do, check the limit.
 *  If the limit is exceeded, delete the earliest entry in the cache and then save new entry.
 * @param req
 * @param res
 */
exports.setData = function(req, res){
    Cache.findOne({"key": req.params.key}).exec(function(err, cache) {
        if (err)
            res.send(500, err.message);
        else {
            if(cache == null){
                createCacheItem(res, req.params.key, req.body.data, "Creating Item");
            }
            else{
                cache.data = req.body.data;
                cache.save(function(err){
                    if(err)
                        res.send(500, err.message);
                    else{
                        var response = {
                            message: "Update successful",
                            data: cache.data
                        };
                        res.send(response);
                    }
                })
            }
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