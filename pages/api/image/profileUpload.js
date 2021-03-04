import AWS from 'aws-sdk';
const fs = require('fs');

/**
 * When the user clicks Log Out
 */

export default async function handler(req, res) {

  // get the image data
  let formData = req.body;
  formData = JSON.stringify(formData);
  // console.log('formData', formData)

  const writeF = new Promise(function(resolve, reject) {
    fs.writeFile('fsfile.jpg', formData, (err, data) => {
      if (err) {
        console.log('fs ERR', err)
        reject(data)
      }
      else {
        console.log('worked?', data);
        resolve(data)
      }
    });
  });

  let file = await writeF;
  // let file = await fs.writeFile('fsfile.jpg', formData, (err) => {
  //   if (err) console.log('fs ERR', err)
  //   else console.log('worked?')
  // });
  console.log('file',file)

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
    Key: 'asdf.jpg',
    Body: file,
    ContentType: "image/jpeg",
    ACL: "public-read",
  };

  // execute upload
  s3.upload(uploadParams, (err, data) => {
    if (err) return console.log('reject', err)
    else return console.log('resolve', data)
  })

  // s3.listObjects({Bucket: 'oscarexpert'}, (err, data) => {
  //   if (err) console.log('err', err)
  //   else console.log('data',data)
  // })

  // return arbitrary object for now (see code below for frontend integration)
  return res.json({});
};

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