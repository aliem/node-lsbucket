var assert = require('assert');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var request = require('request');
var parse = require('./lib/parse')

/**
 * Main export
 *
 * @param {String} bucket
 * @param {String} key
 * @param {String} secret
 * @returns {Stree}
 */
module.exports = function (bucket, key, secret, prefix) {
  return new Stree(bucket, key, secret, (prefix || ''));
}

/**
 * Stree Object
 *
 * @param {String} bucket
 * @param {String} key
 * @param {String} secret
 * @param {String} prefix
 * @returns {Stree}
 */
function Stree (bucket, key, secret, prefix) {
  EventEmitter.call(this);

  assert(!! bucket, 'a "bucket" is required');
  assert(!! key,    'a "key" is required');
  assert(!! secret, 'a "secret" is required');
  assert('string' === typeof prefix, 'a "prefix" is required');

  this.url = 'https://' + bucket + '.s3.amazonaws.com/?prefix=' + prefix +'&max-keys=1000&marker={marker}'
  this.aws = {
    bucket: bucket
  , key: key
  , secret: secret
  }

  return this;
}

util.inherits(Stree, EventEmitter);

/**
 * begin the listing process
 *
 * @param {String} marker
 * @returns {Stree}
 */
Stree.prototype.list = function (marker) {
  var url = this.url.replace('{marker}', marker || '')
  request.get(url, { aws: this.aws }, function (err, res) {
    if (!! err) {
      return this.emit('error', err)
    }

    var list = parse(res.body);
    for (var i = 0; i < list.files.length; i++) {
      this.emit('entry', list.files[i]);
    }

    if (list.truncated) {
      marker = list.marker;
      this.list(marker)
    } else {
      this.emit('end');
    }
  }.bind(this));
  return this;
}

