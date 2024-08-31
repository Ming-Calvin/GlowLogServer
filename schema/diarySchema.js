// 校验
const Joi = require("joi");
const {validations} = require("../middlewares/validation");

// 添加日志参数
const addDiarySchema = Joi.object({
  title: validations.longString,
  mood: validations.shortString,
  content: validations.require
})

// 根据月份查询当月有日记的日期参数
const getDiaryDatesByMonthSchema = Joi.object({
  date: validations.date,
})

// 根据月份查询当月有日记的日期参数
const getDiaryEntriesByDateSchema = Joi.object({
  startDate: validations.date,
  endDate: validations.date,
})


module.exports = { addDiarySchema , getDiaryDatesByMonthSchema, getDiaryEntriesByDateSchema}
