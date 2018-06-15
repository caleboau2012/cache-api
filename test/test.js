var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../bin/www'); // my express app
var should = chai.should();
var assert = require('assert');

chai.use(chaiHttp);

describe('GET requests', function () {

    it.only('should list ALL cache item keys on /data GET', function (done) {
        chai.request(server)
            .get('/data/')
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it.only('should get one item given the key on /data/1 GET', function (done) {
        chai.request(server)
            .get('/data/1')
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    // This test will fail if you change the environment variable max_in_cache
    it.only('Max in cache is currently one so querying for a different item should get the item but delete the count of content in GET all', function (done) {
        chai.request(server)
            .get('/data/2')
            .end(function (err, res) {
                res.should.have.status(200);
                chai.request(server)
                    .get('/data/')
                    .end(function (err, res) {
                        res.should.have.status(200);
                        assert.equal(res.body.data.length, 1);
                        done();
                    });
            });
    });

    it.only('should set cache item for the key 2 on /data/2 POST', function (done) {
        chai.request(server)
            .post('/data/2')
            .send({ data: 'Bounce bounce bounce'})
            .end(function (err, res) {
                res.should.have.status(200);
                assert.equal(res.body.message, "Update successful");
                done();
            });
    });

    // This test will fail if you change the environment variable max_in_cache
    it.only('should create new cache item for the key 1 on /data/1 POST', function (done) {
        chai.request(server)
            .post('/data/1')
            .send({ data: 'Creating a new item :-)'})
            .end(function (err, res) {
                res.should.have.status(200);
                assert.equal(res.body.message, "Creating Item");
                done();
            });
    });

    it.only('should return 404 on /data/2 DELETE', function (done) {
        chai.request(server)
            .delete('/data/2')
            .end(function (err, res) {
                res.should.have.status(404);
                done();
            });
    });

    it.only('should return 200 on deleting all items /data/ DELETE', function (done) {
        chai.request(server)
            .delete('/data/')
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
});