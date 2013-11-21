
/**
 * Dependencies
 */
var Retsly = require('retsly-js-sdk');
var assert = require('assert');
var noop = function () {};

// don't log debugs
Retsly.debug = false;

/**
 * Core API
 */
suite('Retsly');

test('is a constructor', function () {
  assert('function' == typeof Retsly);
});

test('expects two arguments', function () {
  assert(2 == Retsly.length);
  assert.throws(function(){new Retsly()});
  assert.ok(new Retsly('test'));
});

test('has public options property', function () {
  var r = new Retsly('test', {foo: 'bar'});
  assert('bar' == r.options.foo);
});

test('has a socket.io connection', function () {
  var r = new Retsly('test');
  assert(r.io);
});

suite('Retsly#getURL()');

test('builds URLs from fragments', function () {
  var r = new Retsly('test');
  assert('https://rets.io:443/api/v1/test' == r.getURL('test'));
});

suite('Retsly#ready()');

test('calls all functions passed', function (done) {
  var i = 0;
  var fn = function () { i++; if (2==i) done() };
  var r = new Retsly('test');
  r.ready(fn)
   .ready(fn);
});

test('is chainable', function () {
  var r = new Retsly('test')
    .ready(noop)
    .ready(noop);
  assert(r instanceof Retsly);
});

suite('Retsly#request()');

test('calls back with a response', function (done) {
  var r = new Retsly('test').ready(ready);

  function ready () {
    r.request('get', '/api/v1/listings/sandicor.json', cb);
  }

  function cb (res) {
    assert(401 == res.status);
    assert(false === res.success);
    done();
  }
});

test('is chainable', function () {
  var r = new Retsly('test')
    .get('test', noop)
    .post('test2', noop);
  assert(r instanceof Retsly);
});

suite('Retsly#logout()');

test('is chainable', function () {
  var r = new Retsly('test')
    .logout(noop);
  assert(r instanceof Retsly);
});

test('destroys session and calls cb', function (done) {
  var r = new Retsly('test').ready(ready);
  function ready () {
    r.logout(function () {
      assert(true);
      done();
    });
  }
});
