const Router = require("koa-router");
const { PassThrough } = require('stream');
const router = new Router()

const sendMessage = async (stream) => {
  const data = [
    `123`,
    '456'
  ];

  // 循环上面数组: 推送数据、休眠 2 秒
  for (const value of data) {
    stream.write(`data: ${value}\n\n`); // 写入数据(推送数据)
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  // 结束流
  stream.end();
};

// chat by chuck
router.get('/chat', async (ctx) => {
  // 1. 设置响应头
  ctx.set({
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream', // 表示返回数据是个 stream
  });

  // 2. 创建流、并作为接口数据进行返回
  const stream = new PassThrough();
  ctx.body = stream;
  ctx.status = 200;

  // 3. 推送流数据
  sendMessage(stream, ctx)
})

router.post('/chat', async (ctx) => {
  // 1. 设置响应头
  ctx.set({
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream', // 表示返回数据是个 stream
  });

  // 2. 创建流、并作为接口数据进行返回
  const stream = new PassThrough();
  ctx.body = stream;
  ctx.status = 200;

  // 3. 推送流数据
  sendMessage(stream, ctx)
})


module.exports = router;
