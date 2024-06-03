const jwt = require('jsonwebtoken');
require('dotenv').config();  // 加载 .env 文件

const authenticateToken = (req, res, next) => {
    const token = req.headers['token'];

    if (token == null) return res.sendStatus(401);  // 如果没有提供 token，则返回 401

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);  // 如果 token 验证失败，则返回 403
        req.user = user;  // 将用户信息添加到请求对象中
        next();  // 继续执行后续中间件或路由处理函数
    });
};

module.exports = authenticateToken;
