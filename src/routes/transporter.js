const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'QQ',
    "port": 465,
    "secure": true,
    secureConnection: true, // 使用了 SSL
    auth: {
        user: '2431165604@qq.com',
        pass: 'cacwegqkcbqceabi'
    }
});

module.exports = transporter;