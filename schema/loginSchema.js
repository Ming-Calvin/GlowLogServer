// 校验
const Joi = require("joi");
const {validations} = require("../middlewares/validation");

// 校验验证码参数
const sendVerificationCodeSchema = Joi.object({
  email: validations.email
})

module.exports = { sendVerificationCodeSchema }
