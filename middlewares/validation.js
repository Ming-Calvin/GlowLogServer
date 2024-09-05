const Joi = require('joi')
// 返回函数
const {failureResponse} = require("../until/responseData");

const validate = (schema) => {
  return async (ctx, next) => {
    const { error, value } = schema.validate({ ...ctx.request.query, ...ctx.request.body }, { abortEarly: false })

    if(error) {
      ctx.status = 400;
      ctx.body = failureResponse(error.message, {}, 400)
    } else {
      ctx.request.validatedBody = value
      await next();
    }
  }
}

const validations = {
  // 必填
  require: Joi.required(),
  // 必填字符串
  requiredString: Joi.string().required(),
  // 邮箱
  email: Joi.string().email().required(),
  // 密码
  password: Joi.string().regex(new RegExp('^(?![a-zA-Z]+$)(?!\\d+$)(?![^\\da-zA-Z\\s]+$).{8,16}$')).required().error(new Error('Password must contain at least one digit, one uppercase letter, one lowercase letter, and be at least 8 characters long.')),
  // 50以内
  shortString: Joi.string().max(50).required(),
  // 10~100
  mediumString: Joi.string().min(10).max(100).required(),
  // 255以内
  longString: Joi.string().max(255).required(),
  // 时间
  date: Joi.date().required(),
}

module.exports = { validate, validations }
