const Router = require('koa-router')
const router = new Router()
const { WhiteNoise } = require('../models')
const authMiddleware = require('../middlewares/auth')
const upload = require('../middlewares/upload')
const path = require('path')

// get the list of available white noises
router.get('/white-noises', authMiddleware, async (ctx) => {
  try {
    const whiteNoises = await WhiteNoise.findAll();
    ctx.body = { message: whiteNoises, code: 200 }
  } catch (error) {
    ctx.staus = 500;
    ctx.body = { message: 'An error occurred while fetching white noise list', error}
  }
})

// upload a new white noise file
router.post('/white-noises/upload', authMiddleware, upload, async (ctx) => {

  ctx.body = ctx


  try {
    const { files } = ctx.request.body

    return

    const file = files.file

    const fileName = path.basename(file.path)
    const fileUrl = `${ ctx.origin }/uploads/$fileName`

    const newWhiteNoise = await WhiteNoise.create({
      name: ctx.request.body.name,
      url: fileUrl
    })

    ctx.body = newWhiteNoise
  } catch (error) {
    ctx.staus = 500
    ctx.body = { message: 'An error occurred while uploading white noise', error }
  }
})


router.get('/getNoise/:id',authMiddleware, async (ctx) => {
  try {
    const whiteNoiseId = ctx.params.id
    const whiteNoise = await WhiteNoise.findByPk(whiteNoiseId)

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
