// 校验
const Joi = require("joi");
const {validations} = require("../middlewares/validation");

// 校验验证码参数
const sendVerificationCodeSchema = Joi.object({
  email: validations.email
})

// 注册参数
const registrationSchema = Joi.object({
  code: validations.require,
  username: validations.shortString,
  email: validations.email,
  password: validations.password
})

// 登录参数
const loginSchema = Joi.object({
  email: validations.email,
  password: validations.require
})



module.exports = { sendVerificationCodeSchema, registrationSchema, loginSchema }
