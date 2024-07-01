const Router = require('koa-router')
const router = new Router()
const bcrypt = require('bcrypt')
const jwt= require('jsonwebtoken')
const { User, UserInfo, VerificationCode, Sequelize } = require('../models')
const { validate, validations } = require('../middlewares/validation')
const Joi = require('joi')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const moment = require('moment')
const { Op } = Sequelize;
const authMiddleware = require('../middlewares/auth')
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY

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

const sendCodeSchema = Joi.object({
  email: validations.email
})

// Send verification code
router.post('/send-code',validate(sendCodeSchema), async (ctx) => {
  const { email } = ctx.request.validatedBody;

  // Generate a verification code and set an expiration time
  const code = generateVerificationCode()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

  try {
    // Save the verification code to database
    await VerificationCode.create({ email, code, expiresAt })

    // Send the verification code via email
    await transporter.sendMail({
      from: 'grow_log_app@163.com',
      to: email,
      subject: 'Register Verification Code',
      text: `verification code is ${code}`
    })

    ctx.body = { code:200, message: 'verification code sent'}
  } catch(error) {
    ctx.status = 500
    ctx.body = { message: 'failed', error }
  }
})

// define the schema for registration validating using custom attributes
const registrationSchema = Joi.object({
  code: validations.require,
  username: validations.requiredString,
  email: validations.email,
  password: validations.password,
  // firstName: validations.requiredString,
  // lastName: validations.requiredString,
  // age: validations.age,
})

// Register a new User
router.post('/register', validate(registrationSchema),async(ctx) => {
  const { username, email, password, firstName, lastName, age, isMember, code } = ctx.request.validatedBody;

  // check if the verification code is valid
  try {
    const verification = await VerificationCode.findOne({
      where: {
        email,
        code,
        expiresAt: {
          [Op.gt]: new Date() // check that the code is still valid
        }
      },
      order: [['createdAt', 'DESC']] // ensure we get the latest code
    })

    if(!verification) {
      ctx.status = 400;
      ctx.body = { message: 'Invalid or expired verification code'}
      return
    }
  } catch (e) {
    console.log(e, 'verification code')
  }

  // check if the email is already registered
  try {
    const existingUser = await User.findOne({ where: { email } })

    if(existingUser) {
      ctx.status = 400
      ctx.body = { message: 'Email is already registered' }
      return
    }
  } catch (e) {
    console.log(e, 'email already registered')
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ username, email, password: hashedPassword, isMember })


    await UserInfo.create({ firstName, lastName, age, userId: user.userId })

    ctx.status = 200
    ctx.body = { code: 200, message: 'User registration success' }

  } catch (error) {

    ctx.status = 400
    ctx.body = { message: 'User registration failed', error }

  }
})

const loginSchema = Joi.object({
  email: validations.email,
  password: validations.requiredString,
})


router.post('/login', validate(loginSchema), async (ctx) => {
  const { email, password } = ctx.request.validatedBody

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } })

    // Check if user exists and password matches
    if(!user || !await bcrypt.compare(password, user.password)) {
      ctx.status = 401;
      ctx.body = { massage: 'Invalid email or password' }
      return
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.userId }, SECRET_KEY, { expiresIn: '200h' })

    ctx.body = { code:200, message: 'Login successful', token }
  } catch (error) {
    ctx.status = 400
    ctx.body = { message: 'Login failed', error}
  }
})


router.get('/userInfo', authMiddleware, async (ctx) =>{
  const userId = ctx.state.user.userId

  try {
    // Find user by ID and include associated information
    const user = await User.findByPk(userId, {
      include: { model: UserInfo, as: 'info'}
    })

    // check if user exists
    if(!user) {
      ctx.status = 404
      ctx.body = { message: 'User not found' }
      return
    }

    ctx.body = { code: 200, user }
  } catch (error) {
    ctx.status = 400;
    ctx.body = { message: 'Failed to fetch user information', error }
  }
})


module.exports = router;
