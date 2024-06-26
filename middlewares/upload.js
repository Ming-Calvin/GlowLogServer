const path = require('path')
const fs = require('fs')
const { koaBody } = require('koa-body')

//  Get the parent directory of _dirname
const parentDir = path.resolve(__dirname, '..')
const uploadDir = path.join(parentDir, 'uploads')

if(!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

const upload = koaBody({
  multiple: true,
  formidable: {
    uploadDir,
    keepExtensions: true,
    maxFileSize: 200 * 1024 * 1024  // maximum file size in bytes
  }
})

module.exports = upload
