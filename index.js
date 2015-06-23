'use strict'

var assert = require('assert')
var util = require('util')
var EventEmitter = require('events').EventEmitter
var request = require('request')
var parse = require('./lib/parse')
var url = require('url')

/**
 * Main export
 *
 * @param {String} bucket   S3 bucket
 * @param {String} key      S3 key
 * @param {String} secret   S3 secret
 * @param {String} prefix   optional prefix
 * @returns {Stree}         Stree instance
 */
module.exports = function (bucket, key, secret, prefix) {
  return new Stree(bucket, key, secret, (prefix || ''))
}

/**
 * Export the Event Emitter
 */
module.exports.Stree = Stree

/**
 * Stree Object
 *
 * @param {String} bucket   S3 bucket
 * @param {String} key      S3 key
 * @param {String} secret   S3 secret
 * @param {String} prefix   optional prefix
 * @returns {Stree}         Stree instance
 */
function Stree (bucket, key, secret, prefix) {
  EventEmitter.call(this)

  assert(!!bucket, 'a "bucket" is required')
  assert(!!key, 'a "key" is required')
  assert(!!secret, 'a "secret" is required')
  assert(typeof prefix === 'string', 'a "prefix" is required')

  this.url = url.format(util.format(
    'https://%s.s3.amazonaws.com/?prefix=%s&max-keys=1000', bucket, prefix))
  this.aws = {
    bucket: bucket
  , key: key
  , secret: secret
  }
}

util.inherits(Stree, EventEmitter)

/**
 * begin the listing process
 *
 * @param {String}  marker    marker
 * @returns {Stree}           this
 */
Stree.prototype.list = function (marker) {
  var requestUrl = this.url
  if (marker) {
    url = url + '&marker=' + marker
  }

  request.get(requestUrl, { aws: this.aws }, function (err, res) {
    if (err) return this.emit('error', err)

    var list = parse(res.body)
    for (var i = 0; i < list.files.length; i++) {
      this.emit('entry', list.files[i])
    }

    if (list.truncated) {
      marker = list.marker
      this.list(marker)
    } else {
      this.emit('end')
    }
  }.bind(this))
  return this
}
