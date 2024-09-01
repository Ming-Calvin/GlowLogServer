// 路由
const Router = require('koa-router')
const router = new Router()
// 校验
const {validate} = require("../middlewares/validation");
const {uploadWhiteNoise} = require("../schema/whiteNoiseSchema");
// token校验
const authMiddleware = require("../middlewares/auth");
// 数据库
const { WhiteNoise, Attachment, sequelize} = require("../models");
// 上传中间件
const upload = require("../middlewares/upload");
// 返回数据
const {successResponse, failureResponse} = require("../until/responseData");
const path = require("path");

router.post('/uploadWhiteNoise',
  authMiddleware,
  upload.single('file'),
  async (ctx, next) => {
    // 将 multer 解析的数据复制到 ctx.request.body 以便 Joi 可以验证
    ctx.request.body = ctx.req.body;
    await next();
  },
  validate(uploadWhiteNoise),
  async (ctx, next) => {

  const { tag, name, description, duration } = ctx.request.validatedBody;
  const { file } = ctx.req

  // 开始事务
  const transaction = await sequelize.transaction()

  try {
    // 检查文件是否已上传
    if (!file) {
      ctx.status = 400;
      ctx.body = failureResponse('No file uploaded or invalid file type.');
      return;
    }

    // 获取文件的基本信息
    const fileName = path.basename(file.path)
    const fileUrl = `${ ctx.origin }/files/${ fileName }`

    const whiteNoise = await WhiteNoise.create({
      tag,
      name,
      description,
      duration
    }, { transaction })

    console.log(whiteNoise, 'whiteNoise')

    // 创建新的附件记录
    await Attachment.create({
      business_id: whiteNoise.white_noise_id, // 这里使用 diary_id 作为 business_id
      business_type: 'whiteNoise', // 设置业务类型为 'diary'
      file_url: fileUrl, // 文件的存储路径
    }, { transaction });

    // 提交事务
    await transaction.commit();

    ctx.body = successResponse('add whiteNoise entry successfully.')
  } catch(e) {
    await transaction.rollback(); // 回滚事务

    ctx.status = 500;
    ctx.body = failureResponse('An error occurred while creating the journal entry.')
  }
})

// 根据白噪音ID获取白噪音内容接口
router.get('/getWhiteNoiseById/:id',authMiddleware, async (ctx, next) => {
  try {
    const id = ctx.params.id;
    const whiteNoise = await WhiteNoise.findByPk(id);

    if (!whiteNoise) {
      ctx.status = 404;
      ctx.body = failureResponse('WhiteNoise entry not found')
      return;
    }

    const file = await Attachment.findByPk(whiteNoise.white_noise_id)

    ctx.body = successResponse('success', { whiteNoise, file });
  } catch (error) {
    ctx.status = 500;
    ctx.body = failureResponse('An error occurred while fetching the WhiteNoise entries.')
  }
})


module.exports = router;