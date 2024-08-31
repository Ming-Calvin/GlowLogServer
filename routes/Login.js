// 路由
const Router = require('koa-router')
const router = new Router()
// 校验
const {validate} = require("../middlewares/validation");
const { sendVerificationCodeSchema } = require("../schema/loginSchema");
// 调用方法
const { generateVerificationCode, transporter } = require("../until/loginFun");
// 数据库
const { VerificationCode } = require("../models");
// 返回函数
const {successResponse, failureResponse} = require("../until/responseData");

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

module.exports = router