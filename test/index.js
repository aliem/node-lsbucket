var test = require('tape');
var lsbucket = require('../index');

test('lsbucket', function (t) {
  var instance = lsbucket('bucket', 'key', 'secret', 'prefix');

  t.ok(instance instanceof lsbucket.Stree, 'should return an instance of Stree');

  try {
    lsbucket();
  } catch (e) {
    t.ok(!! e, 'should throw an error if no S3 bucket is specified');
  }
  try {
    lsbucket('bucket');
  } catch (e) {
    t.ok(!! e, 'should throw an error if no S3 key is specified');
  }
  try {
    lsbucket('bucket', 'key');
  } catch (e) {
    t.ok(!! e, 'should throw an error if no S3 secret is specified');
  }

  instance = lsbucket('bucket', 'key', 'secret', 'prefix with spaces');
  t.ok(~instance.url.indexOf('prefix%20with%20spaces'), 'should urlencode the optional "prefix"');

  t.end();
});
