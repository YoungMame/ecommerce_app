const multer = require("multer")

const IMGS_MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

const imgStorage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'uploads/images');
    },
    filename: (req, file, callback) => {
      const name = file.originalname.split(' ').join('_')
      const extension = MIME_TYPES[file.mimetype]
      callback(null, name + Date.now() + '.' + extension)
    }
  });
  
  const imgUpload = multer({ storage: storage }).array('images', 10) // Accepter jusqu'à 10 fichiers
  
  module.exports.imageUpload = imgUpload