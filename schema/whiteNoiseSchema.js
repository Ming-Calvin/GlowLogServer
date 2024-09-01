// 校验
const Joi = require("joi");
const {validations} = require("../middlewares/validation");

// 上传白噪音参数
const uploadWhiteNoise = Joi.object({
  tag: validations.shortString,
  name: validations.shortString,
  description: validations.require,
  duration: validations.require
})


module.exports = { uploadWhiteNoise }
