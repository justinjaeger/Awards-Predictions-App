import AWS from 'aws-sdk';

/**
 * After user uploads new profile picture,
 * this gets rid of the old one in Spaces
 */

export default async (req, res) => {
 
  // get the key from the query
  const key = req.body.previousKey;
  console.log('key', key)

  // create S3 instance with credentials
  const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint('nyc3.digitaloceanspaces.com'),
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
    region: 'nyc3',
  });

  const params = { 
    Bucket: process.env.SPACES_BUCKET,
    Key: key,
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.log('err deleting profile image from Spaces',err)
      return res.status(500);
    };
    if (data) {
      return res.json({});
    };
  })
};
 