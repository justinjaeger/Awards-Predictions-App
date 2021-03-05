const AWS = require('aws-sdk')

const imageController = {};
let result;
/*************************************/

imageController.uploadProfileImage = async (req, res) => {

  let { file } = res.locals;
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

  const s3UploadPromise = new Promise(function(resolve, reject) {
    s3.upload(uploadParams, (err, data) => {
      if (err) {
        console.log('reject', err)
        reject(err);
      } else {
        console.log('resolve', data)
        resolve(data);
      }
    })
  });

  await s3UploadPromise
    .then(result => {
      console.log('result', result)
      res.locals.url = result.Location;
    })
    .catch(err => {
      console.log('err',err)
    })
}; 

/*************************************/

export default imageController;