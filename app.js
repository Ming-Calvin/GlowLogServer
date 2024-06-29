const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const router = require('./routes')
const path = require('path')
const serve = require('koa-static')
const mount = require('koa-mount')

const app = new Koa()

// Serve static files from the 'uploads' directory(need used before other route)
app.use(mount('/files', serve(path.join(__dirname, 'uploads'))))


app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, () => {
  console.log('running on port 3000')
})
