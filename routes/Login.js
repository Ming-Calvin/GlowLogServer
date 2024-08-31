// 路由
const Router = require('koa-router')
const router = new Router()
// 校验
const {validate} = require("../middlewares/validation");
const { sendVerificationCodeSchema, registrationSchema, loginSchema } = require("../schema/loginSchema");
// 调用方法
const { generateVerificationCode, transporter } = require("../until/loginFun");
// 数据库
const { VerificationCode, User, Sequelize, sequelize} = require("../models");
// 返回函数
const {successResponse, failureResponse} = require("../until/responseData");
// 时间方法
const { Op } = Sequelize
// 加密
const bcrypt = require('bcrypt')
// token创建
const jwt = require("jsonwebtoken");
// 加载环境变量 获取JWT密钥
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY

// 用户发送验证码接口
router.post('/sendVerificationCode',validate(sendVerificationCodeSchema), async (ctx) => {
  const { email } = ctx.request.validatedBody;

  // 验证码
  const code =  generateVerificationCode()
  // 有效时间
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10分钟

  try {
    // 保存验证码到数据库
    await VerificationCode.create({ email, code, expires_at: expiresAt })

    // 发送邮件
    await transporter.sendMail({
      from: 'grow_log_app@163.com',
      to: email,
      subject: 'Register Verification Code',
      text: `verification code is ${code}`
    })

    ctx.body = successResponse('verification code sent')
  } catch(error) {
    ctx.status = 500
    ctx.body = failureResponse('verification code sent')
  }
})

// 注册接口
router.post('/registerUser', validate(registrationSchema),async(ctx) => {
  const { code, username, email, password } = ctx.request.validatedBody;

  // 开始事务
  const transaction = await sequelize.transaction();

  try {
    // 确认邮箱未注册
    const existingUser = await User.findOne({where: {email}, transaction});

    if (existingUser) {
      ctx.status = 400;
      ctx.body = failureResponse('Email is already registered', {}, 400);
      return
    }

    // 验证验证码
    const verification = await VerificationCode.findOne({
      where: {
        email,
        code,
        expires_at: {
          [Op.gt]: new Date() // 验证码尚未过期
        }
      },
      order: [['created_at', 'DESC']],
      transaction
    });

    if (!verification) {
      ctx.status = 400;
      ctx.body = failureResponse('Invalid or expired verification code', {}, 400)
      return;
    }

    // 加密密码并创建用户
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword }, { transaction })

    // 提交事务
    await transaction.commit()

    ctx.body = successResponse('User registration successful')
  } catch (error) {
    // 如果发生错误，回滚事务
    await transaction.rollback()

    ctx.status = 500; // 服务器错误
    ctx.body = failureResponse('User registration failed', {}, 500);
  }
})

// 登录接口
router.post('/loginUser', validate(loginSchema), async (ctx) => {
  const { email, password } = ctx.request.validatedBody

  try {
    // 找到用户邮箱
    const user = await User.findOne({ where: { email } })

    // 确认用户是否存在
    if(!user) {
      ctx.status = 401;
      ctx.body = failureResponse( 'Invalid email or password', {}, 401)
      return
    }

    // 校验密码
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      ctx.status = 401;
      ctx.body = failureResponse('Invalid email or password', {}, 401);
      return;
    }

    // 创建Token
    const token = jwt.sign({ userId: user.userId }, SECRET_KEY, { expiresIn: '24h' })

    ctx.body = successResponse('Login successful', { token })
  } catch (error) {
    ctx.status = 400

    ctx.body = failureResponse( error.message, {}, 400)
  }
})


module.exports = router