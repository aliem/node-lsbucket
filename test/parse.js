var test = require('tape')
var fs = require('fs')

var parse = require('../lib/parse')

test('XML response parser', function (t) {

  t.equal(parse.length, 1, 'The parse function accepts one parameter')

  t.test('simple response', function (t) {
    var body = fs.readFileSync(__dirname + '/fixtures/simple.xml', 'utf-8')
    var o = parse(body)

    t.ok(Array.isArray(o.files), 'files should be an array')
    t.ok('string' === typeof o.marker, 'marker should be a string')
    t.equal(o.marker, o.files[o.files.length -1], 'marker should be the last file in the list')

    t.end()
  })

  t.test('prefixed response', function (t) {
    var body = fs.readFileSync(__dirname + '/fixtures/prefix.xml', 'utf-8')
    var o = parse(body)

    t.deepEqual(o.files, ['Nelson','Neo'])
    t.end()
  })

  t.end()
})
