const express = require('express')
const userService = require('../services/userService')
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const transporter = require('./transporter')
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const authenticateToken = require('../middleware/authMiddleware');
const User = require("../models/User");

router.post('/register', async (req, res) => {
    const { email, password, userName, registrationCode } = req.body;

    try {
        // 验证 code
        const isValidCode = await userService.validateCode(email, registrationCode);
        if (!isValidCode) {
            return res.status(400).json({ error: 'Invalid or expired verification code' });
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        // 注册函数
        await userService.register(email, hashedPassword, userName)
        res.status(201).send('User registered successfully')
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await userService.login(email)
        if(users.length === 0) {
            // 没有用户
            return res.status(404).send('User not found')
        }

        const user = users[0]
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            // 密码匹配
            return res.status(401).send("Invalid credentials")
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Logged in successfully', token})
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post('/send-code', async (req, res) => {
    const { email } = req.body;
    const code = Math.random().toString().slice(-6)
    const expiresAt = new Date()
    // 十分钟过期
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    try {
        await userService.sendCode(email, code, expiresAt)

        // 读取HTML模板文件
        const htmlTemplatePath = path.join(__dirname, 'emailTemplate.html');
        const htmlContent = fs.readFileSync(htmlTemplatePath, 'utf8');
        const htmlToSend = htmlContent.replace('{{CODE}}', code);

        let mailOptions = {
            from:  '"Registration Code form GrowLog" <2431165604@qq.com>',
            to: email,
            subject: 'Your Verification Code',
            html: htmlToSend
        };
        try {
            await transporter.sendMail(mailOptions);
        } catch (err) {
            console.log(err)
        }


        res.send('Verification code sent to your email.');
    } catch (err) {
        res.status(500).send('Failed to send verification code.');
    }
})

// 获取用户名路由
router.get('/getUserInfo', authenticateToken, async (req, res) => {
    const userId = req.user.id;  // 从 token 中获取 userId

    try {
        const userInfo = await User.getUserInfo(userId);
        if (!userInfo) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json( userInfo[0] );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;