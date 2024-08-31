const jwt = require('jsonwebtoken')
const {failureResponse} = require("../until/responseData");

module.exports = async (ctx, next) => {
  const token = ctx.headers['authorization']

  if(!token) {
    ctx.status = 401;
    ctx.body = failureResponse('Authorization token is required', {}, 401)
    return
  }

  // 解析token格式
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // 解码后的用户信息放在ctx.state.user中
    ctx.state.user  = decoded;

    // 正确处理异步操作
    await next();
  } catch (error) {
    ctx.status = 401;

    ctx.body = failureResponse('Invalid token', error, 401)
  }
}
