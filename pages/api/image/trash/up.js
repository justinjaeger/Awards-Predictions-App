import wrapper from 'utils/wrapper';

const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

/*************************************/

// const handler = (request, response) => {

  // let file  = req.body;
  // file = JSON.stringify(file);

  export const config = {
    api: {
      bodyParser: false,
    },
  }

  const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint('nyc3.digitaloceanspaces.com'),
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
    region: 'nyc3',
  });

  // Change bucket property to your Space name
  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'oscarexpert',
      acl: 'public-read',
      key: function (request, file, cb) {
        console.log(file);
        cb(null, file.originalname);
      }
    })
  }).array('upload', 1);

  upload(request, response, function (error, data) {
    if (error) console.log(error)
    else console.log('File uploaded successfully.', data)
  });

  // const uploadParams = {
  //   Bucket: 'oscarexpert',
  //   Key: 'image-upload', // file path
  //   Body: file,
  //   ContentType: "image/jpeg",
  //   ACL: "public-read",
  // };

  // s3.upload(uploadParams, (err, data) => {
  //   if (err) return console.log('reject', err)
  //   else return console.log('resolve', data)
  // })

//   return response.json({});
// };

// export default wrapper(handler);
