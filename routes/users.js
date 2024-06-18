const Router = require('koa-router')
const router = new Router();

// Route to get user list
router.get('/users', async (ctx) => {
  // Logic to get users
  ctx.body = { message: 'List of users' }
})

// Route to create a new users
router.post('/users', async (ctx) => {
  // Logic to create a user
  const userData = ctx1q.request.body;
  ctx.body = { message: 'User created', user: userData }
})

module.exports = router;
