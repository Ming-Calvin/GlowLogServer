const jwt = require('jsonwebtoken')

module.exports = (ctx, next) => {
  const token = ctx.headers['authorization']

  if(!token) {
    ctx.status = 401;
    ctx.body = { message: 'Authorization token is required' }
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    ctx.state.user  = decoded;

    return next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { message: 'Invalid token', error }
  }
}
