const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const router = require('./routes')

const app = new Koa()

app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, () => {
  console.log('running on port 3000')
})
