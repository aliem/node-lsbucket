'use strict'

var test = require('tape')
var path = require('path')
var fs = require('fs')

var parse = require('../lib/parse')

test('XML response parser', function (tt) {

  tt.equal(parse.length, 1, 'The parse function accepts one parameter')

  tt.test('simple response', function (t) {
    var body = fs.readFileSync(path.join(__dirname, '/fixtures/simple.xml'), 'utf-8')
    var o = parse(body)

    t.ok(Array.isArray(o.files), 'files should be an array')
    t.ok(typeof o.marker === 'string', 'marker should be a string')
    t.equal(o.marker, o.files[o.files.length - 1].Key, 'marker should be the last file in the list')

    t.end()
  })

  tt.test('prefixed response', function (t) {
    var body = fs.readFileSync(path.join(__dirname, '/fixtures/prefix.xml'), 'utf-8')
    var o = parse(body)

    var expected = [{
      ETag: '"828ef3fdfa96f00ad9f27c383fc9ac7f"',
      Key: 'Nelson',
      LastModified: '2006-01-01T12:00:00.000Z',
      Owner: { DisplayName: 'webfile', ID: 'bcaf161ca5fb16fd081034f' },
      Size: '5',
      StorageClass: 'STANDARD'
    }, {
      ETag: '"828ef3fdfa96f00ad9f27c383fc9ac7f"',
      Key: 'Neo',
      LastModified: '2006-01-01T12:00:00.000Z',
      Owner: { DisplayName: 'webfile', ID: 'bcaf1ffd86a5fb16fd081034f' },
      Size: '4',
      StorageClass: 'STANDARD'
    }]

    t.deepEqual(o.files, expected)
    t.end()
  })

  tt.end()
})
