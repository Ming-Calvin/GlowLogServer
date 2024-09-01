// 校验
const Joi = require("joi");
const {validations} = require("../middlewares/validation");

// 修改密码参数
const updatePasswordSchema = Joi.object({
  password: validations.password,
  code: validations.require
})


module.exports = { updatePasswordSchema }
