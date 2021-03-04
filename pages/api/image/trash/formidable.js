const formidable = require('formidable-serverless');
const http = require('http');
const util = require('util');

export const config = {
  api: {
    bodyParser: false,
  }
}

export default async (req, res) => {
  const data = await new Promise(function(resolve, reject) {
    const form = formidable();

    form.keepExtensions = true;
    form.keepFilename = true;

    form.parse(req, (err, fields, files) => {

      const s3 = new AWS.S3({
        endpoint: new AWS.Endpoint('nyc3.digitaloceanspaces.com'),
        accessKeyId: process.env.SPACES_KEY,
        secretAccessKey: process.env.SPACES_SECRET,
        region: 'nyc3',
      });

      const params = {
        Bucket: 'mybucket',
        Key: `folder/${files.file.name}`,
        ACL: 'public-read',
        Body: require('fs').createReadStream(files.file.path),
      };

      // s3.upload(params, (err, data) => {
      //   resolve({ err, data });
      // });
      s3.upload(params, (err, data) => {
        if (err) return console.log('reject', err)
        else return console.log('resolve', data)
      })

      if (err) return reject(err);
      resolve({ fields, files });
    });

  });
}

// http.createServer(function(req, res) {
//   if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
//     // parse a file upload
//     const form = new formidable.IncomingForm();

//     form.parse(req, function(err, fields, files) {
//       res.writeHead(200, {'content-type': 'text/plain'});
//       res.write('received upload:\n\n');
//       res.end(util.inspect({fields: fields, files: files}));
//     });

//     return;
//   }

//   // show a file upload form
//   res.writeHead(200, {'content-type': 'text/html'});
//   res.end(
//     '<form action="/upload" enctype="multipart/form-data" method="post">'+
//     '<input type="text" name="title"><br>'+
//     '<input type="file" name="upload" multiple="multiple"><br>'+
//     '<input type="submit" value="Upload">'+
//     '</form>'
//   );
// }).listen(8080);