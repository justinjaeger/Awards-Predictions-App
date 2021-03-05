const AWS = require('aws-sdk')

// definitely correct
AWS.config.update({
  region: 'nyc3',
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
});
 
// also likely correct
const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint('nyc3.digitaloceanspaces.com')
});
 
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'oscarexpert',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: 'TESTING_METADATA'});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    },
    acl: 'public-read'
  })
})

module.exports = upload;