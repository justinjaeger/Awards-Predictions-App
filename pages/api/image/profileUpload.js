import AWS from 'aws-sdk';

export default async function handler(req, res) {

  // get the image data
  let image = req.body;

  // create S3 instance with credentials
  const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint('nyc3.digitaloceanspaces.com'),
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
    region: 'nyc3',
  });
  
  // create parameters for upload
  const uploadParams = {
    Bucket: 'oscarexpert',
    Key: 'asdff',
    Body: image,
    ContentType: "image/jpeg",
    ACL: "public-read",
  };

  // execute upload
  s3.upload(uploadParams, (err, data) => {
    if (err) return console.log('reject', err)
    else return console.log('resolve', data)
  })

  // returning arbitrary object for now
  return res.json({});
};

// s3.listObjects({Bucket: 'oscarexpert'}, (err, data) => {
  //   if (err) console.log('err', err)
  //   else console.log('data',data)
  // })


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