const path = require('path')
const multer = require('koa-multer')

//  define the upload directory
const uploadDir = path.join(__dirname, '../uploads')

// Configure storage options for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname) )
  }
})

// create the multer instance with the storage configuration
const upload = multer({ storage: storage })

module.exports = upload
