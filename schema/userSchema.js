// 校验
const Joi = require("joi");
const {validations} = require("../middlewares/validation");

// 修改密码参数
const updatePasswordSchema = Joi.object({
  password: validations.password,
  code: validations.require
})

// 删除账号参数
const deleteAccountSchema = Joi.object({
  code: validations.require
})


module.exports = { deleteAccountSchema }
