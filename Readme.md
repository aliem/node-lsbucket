# ls bucket recursively

Lists all the keys inside an S3 Bucket

```js

var lsbucket = require('lsbucket')

var bucket = lsbucket('my-bucket', 'AWS_KEY', 'AWS_SECRET');

bucket.on('entry', function (entry) {
   console.log('Entry: %s', entry);
});

bucket.on('end', function () {
    process.exit()
});

bucket.list();
```


# License

MIT
