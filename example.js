var lsbucket = require('./')

var bucket = lsbucket(process.env.S3BUCKET, process.env.AWS_KEY, process.env.AWS_SECRET);

bucket
.on('entry', function (entry) {
    console.log('> %s', entry)
})
.on('error', function (e) {
  console.error(e.message);
  process.exit(1)
})
.on('end', function () {
  process.exit()
})
.list()
