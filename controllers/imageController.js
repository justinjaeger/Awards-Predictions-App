const AWS = require('aws-sdk')

const imageController = {};
let result;
/*************************************/

imageController.uploadProfileImage = async (req, res) => {

  let { file } = res.locals;
  file = JSON.stringify(file);

  // console.log('file', file)

  // AWS.config.update({
  //   region: 'nyc3',
  //   accessKeyId: process.env.SPACES_KEY,
  //   secretAccessKey: process.env.SPACES_SECRET,
  // });
  
  const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint('nyc3.digitaloceanspaces.com'),
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
  });

  const uploadParams = {
    Bucket: 'oscarexpert',
    Key: 'image-upload',
    Body: file,
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