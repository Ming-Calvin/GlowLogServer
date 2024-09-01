const Router = require('koa-router')
const router = new Router()
const { WhiteNoise: Whitenoise1111 } = require('../models')
const authMiddleware = require('../middlewares/auth')
const upload  = require('../middlewares/upload')
const path = require('path')

// get the list of available white noises
router.get('/white-noises', authMiddleware, async (ctx) => {
  try {
    const whiteNoises = await Whitenoise1111.findAll();
    ctx.body = { whiteNoises, code: 200 }
  } catch (error) {
    ctx.staus = 500;
    ctx.body = { message: 'An error occurred while fetching white noise list', error}
  }
})

// upload a new white noise file
router.post('/white-noises/upload', upload.single('file'), async (ctx) => {

  try {
    const { file } = ctx.req
    const { name } = ctx.req.body

    if(!file) {
      ctx.staus = 400
      ctx.body = { message: "No file uploaded" }
      return
    }

    const fileName = path.basename(file.path)
    const fileUrl = `${ ctx.origin }/files/${ fileName }`

    const newWhiteNoise = await Whitenoise1111.create({
      name: name,
      url: fileUrl
    })

    ctx.body = newWhiteNoise
  } catch (error) {
    ctx.staus = 500
    ctx.body = { message: 'An error occurred while uploading white noise', error }
  }
})

router.get('/getWhiteNoise/:id',authMiddleware, async (ctx) => {
  try {
    const whiteNoiseId = ctx.params.id
    const whiteNoise = await Whitenoise1111.findByPk(whiteNoiseId)

    if(!whiteNoise) {
      ctx.staus = 404
      ctx.body = { message: 'White noise not found' }
      return
    }

    ctx.body = {
      name: whiteNoise.name,
      url: whiteNoise.url
    }
  } catch (error) {
    ctx.staus = 500
    ctx.body = { message: 'An error occurred while selecting white noise', error }
  }


})

module.exports = router
