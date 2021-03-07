import AWS from 'aws-sdk';
import formidable from 'formidable-serverless';
import fs from 'fs';
const sharp = require('sharp');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {

  // get the key from the query
  const key = req.query.key;

  // create S3 instance with credentials
  const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint('nyc3.digitaloceanspaces.com'),
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
    region: 'nyc3',
  });

  // parse request to readable form
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    // Account for parsing errors
    if (err) return res.status(500);
    // Convert to binary string
    const file = fs.readFileSync(files.file.path);

    console.log('file',file)

    const params = { 
      Bucket: process.env.SPACES_BUCKET,
      ACL: "public-read",
      Key: `ProfileImages/${key}`,
      Body: file,
      ContentType: "image/jpeg",
    };

    // Downsize the image
    await sharp(file)
      .resize(200,200) // width, height
      .toBuffer()
      .then(buffer => {
        console.log('sharp success', buffer)
        params.Body = buffer;
      })
      .catch(err => {
        console.log('sharp faliure', err)
      })
    
    // Upload and send the file
    await s3.upload(params)
      .send((err, data) => {
        if (err) {
          console.log('err',err)
          return res.status(500);
        };
        if (data) {
          console.log('data',data)

          return res.json({
            url:  data.Location,
          });
        };
    });
  });
};
