import wrapper from 'utils/wrapper';

const AWS = require('aws-sdk')

/*************************************/

const handler = (req, res) => {

  let file  = req.body;
  file = JSON.stringify(file);
  
  const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint('nyc3.digitaloceanspaces.com'),
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
    region: 'nyc3',
  });

  const uploadParams = {
    Bucket: 'oscarexpert',
    Key: 'image-upload', // file path
    Body: file,
    ContentType: "image/jpeg",
    ACL: "public-read",
  };

  s3.upload(uploadParams, (err, data) => {
    if (err) return console.log('reject', err)
    else return console.log('resolve', data)
  })

  return res.json({});
};

export default wrapper(handler);
