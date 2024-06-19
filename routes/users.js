const Router = require('koa-router')
const router = new Router()
const bcrypt = require('bcrypt')
const jwt= require('jsonwebtoken')
const { User, UserInfo } = require('../models')
const { validate, validations } = require('../middlewares/validation')
const Joi = require('joi')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

const SECRET_KEY = 'secret_key'

// Function to generate a random verification code
const generateVerificationCode = () => {
  return crypto.randomBytes(3).toString('hex')
}

// set up nodemailer transporter
const transporter = nodemailer.createTransport({
  service: '163',
  auth: {
    user: 'grow_log_app@163.com',
    pass: 'OSBQJMCEZSBYEKQQ'
  }
})

// Send verification code
router.post('/send-code', async (ctx) => {
  const { email } = ctx.request.body;

  // Generate a verification code and set an expiration time (e.g., 10 minutes)
  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  try {
    // Save the verification code to the database
    await VerificationCode.create({ email, code, expiresAt });

    // Send the verification code via email
    await transporter.sendMail({
      from: 'your_email@gmail.com',
      to: email,
      subject: 'Your Verification Code',
      text: `Your verification code is ${code}`
    });

    ctx.body = { message: 'Verification code sent' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: 'Failed to send verification code', error };
  }
});



// define the schema for registration validating using custom attributes
const registrationSchema = Joi.object({
  username: validations.requiredString,
  email: validations.email,
  password: validations.password,
  firstName: validations.requiredString,
  lastName: validations.requiredString,
  age: validations.age,
})

// Register a new User
router.post('/register', validate(registrationSchema),async(ctx) => {
  const { username, email, password, firstName, lastName, age, isMember } = ctx.request.validatedBody;

  try {
    // check if the email is already registered
    const existingUser = await User.findOne({ where: { email } })
    if(existingUser) {
      ctx.status = 400
      ctx.body = { message: 'Email is already registered' }
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ username, email, password: hashedPassword, isMember })
    await UserInfo.create({ firstName, lastName, age, userId: user.id })
    ctx.status = 200
    ctx.body = { message: 'User registration successs' }

  } catch (error) {
    ctx.status = 400
    ctx.body = { message: 'User registration failed', error }
  }
})

module.exports = router;
