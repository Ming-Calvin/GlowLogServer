const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const router = require('./routes')
const path = require('path')
const serve = require('koa-static')
const mount = require('koa-mount')
const cors = require('@koa/cors');

const app = new Koa()

// Serve static files from the 'uploads' directory(need used before other route)
app.use(mount('/files', serve(path.join(__dirname, 'uploads'))))

// Configure CORS options if needed
const corsOptions = {
  origin: '*', // Allow all origins
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these HTTP methods
  allowHeaders: ['Content-Type', 'Authorization'], // Allow these headers
};
app.use(cors(corsOptions));

app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, () => {
  console.log('running on port 3000')
})
