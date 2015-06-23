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

Sample Entry:

```js
{
   ETag: '"828ef3fdfa96f00ad9f27c383fc9ac7f"',
   Key: 'Nelson',
   LastModified: '2006-01-01T12:00:00.000Z',
   Owner: { DisplayName: 'webfile', ID: 'bcaf161ca5fb16fd081034f' },
   Size: '5',
   StorageClass: 'STANDARD'
}
```


# License

MIT
