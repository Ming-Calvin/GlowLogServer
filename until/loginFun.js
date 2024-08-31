// 加密
const crypto = require("crypto");

// 邮箱
const nodemailer = require('nodemailer')

// 生成验证码
const generateVerificationCode = () => {
  return crypto.randomBytes(3).toString('hex')
}

// 设置发送验证码邮箱
const transporter = nodemailer.createTransport({
  service: '163',
  auth: {
    user: 'grow_log_app@163.com',
    pass: 'OSBQJMCEZSBYEKQQ'
  }
})

module.exports = { generateVerificationCode, transporter }