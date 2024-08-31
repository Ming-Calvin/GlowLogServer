// 校验
const Joi = require("joi");
const {validations} = require("../middlewares/validation");

// 添加日志参数
const addDiarySchema = Joi.object({
  title: validations.longString,
  mood: validations.shortString,
  content: validations.require
})

module.exports = { addDiarySchema }
