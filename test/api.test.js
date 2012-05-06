var request = require('request')
  , assert = require('assert')
  , base = 'http://localhost:3000'
  ;

describe('create user', function() {
    it('should not create user', function(done) {
        request.post({
            url: base + '/api/signup'
          , json: {}
          }, function(err, res, body) {
          assert.ok(!err)
          assert.ok(body)
          assert.equal(500, res.statusCode);
          done();
        })
    })

    it('should create user', function(done) {
        request.post({
            url: base + '/api/signup'
          , json: {username: 'test', password: '12345'}
          }, function(err, res, body) {
          assert.equal(200, res.statusCode);
          console.log(body)
          done();
        })
    })

})
