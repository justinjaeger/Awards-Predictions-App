import AWS from 'aws-sdk';
import nextConnect from 'next-connect';
import formidable from 'formidable-serverless';
const multer = require('multer');
const multerS3 = require('multer-s3');

// disable body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// export default async function handler(req, res) {

  // let formData = req.body;
  // formData = JSON.stringify(formData)
  // console.log('formData', formData)

const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint('nyc3.digitaloceanspaces.com'),
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
  region: 'nyc3',
});

  // const uploadParams = {
  //   Bucket: 'oscarexpert',
  //   Key: req.query.file,
  //   Body: formData,
  //   ContentType: "image/jpeg",
  //   ACL: "public-read",
  // };

  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'oscarexpert',
      acl: 'public-read',
      key: function (req, file, cb) {
        console.log('file',file);
        cb(null, file.originalname);
      },
    }),
  });

  const apiRoute = nextConnect({
    onError(error, req, res) {
      res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req, res) {
      res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
  });

  apiRoute.use(upload.array('theFiles'));

  apiRoute.post((req, res) => {
    res.status(200).json({ data: 'success' });
  });

  export default apiRoute;

  // export default (req, res) => {
  //     upload.array('upload', 1)(req, {}, err => {
  //       console.log(req.files);
  //     });
  //     res.json({})
  // };

  // upload(request, response, function (error, data) {
  //   if (error) console.log(error)
  //   else console.log('File uploaded successfully.', data)
  // });

  // const s3UploadPromise = new Promise(function(resolve, reject) {
  //   s3.upload(uploadParams, (err, data) => {
  //     if (err) {
  //       console.log('reject', err)
  //       reject(err);
  //     } else {
  //       console.log('resolve', data)
  //       resolve(data);
  //     }
  //   })
  // });

  // await s3UploadPromise
  //   .then(result => {
  //     console.log('result', result)
  //   })
  //   .catch(err => {
  //     console.log('err',err)
  //   })

//   return res.status(200).json({});
// }



  // const post = await s3.createPresignedPost({
  //   Bucket: process.env.SPACES_BUCKET,
  //   Fields: {
  //     key: req.query.file,
  //   },
  //   // Expires: 60, // seconds
  //   Conditions: [
  //     ['content-length-range', 0, 1048576], // up to 1 MB
  //   ],
  // });