const multer = require('multer');

const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];

const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint('nyc3.digitaloceanspaces.com'),
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
  region: 'nyc3',
});

const storage = multerS3({
  s3: s3,
  bucket: 'oscarexpert',
  acl: 'public-read',
  key: function (req, file, cb) {
    console.log('file',file);
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: function(req, file, cb) {
    if (ALLOWED_FORMATS.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Not supported file type!'), false);
    }
  }
})

const singleUpload = upload.single('image');
const singleUploadCtrl = (req, res, next) => {
  singleUpload(req, res, (error) => {
    if (error) {
      return res.status(422).send({message: 'Image upload fail!'});
    }

    next();
  })
}