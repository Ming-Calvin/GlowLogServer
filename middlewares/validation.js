const Joi = require('joi')
// 返回函数
const {failureResponse} = require("../until/responseData");

const validate = (schema) => {
  return async (ctx, next) => {
    const { error, value } = schema.validate(ctx.request.body, { abortEarly: false })

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
  require: Joi.required(),
  requiredString: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().regex(new RegExp('^(?![a-zA-Z]+$)(?!\\d+$)(?![^\\da-zA-Z\\s]+$).{8,16}$')).required().error(new Error('Password must contain at least one digit, one uppercase letter, one lowercase letter, and be at least 8 characters long.')),
  age: Joi.number().integer().min(0).required()
}

module.exports = { validate, validations }
