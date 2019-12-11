const Koa = require('koa')
const WebSocket = require('ws');
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
// const users = require('./routes/users')


const ws = new WebSocket.Server({port: 8888});

// const wsData = {
//   title: 'hello',
//   msg: 'world!'
// }

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())

// 连接池
let clients = [];

ws.on('connection', ws => {
  console.log('server connection');
  clients.push(ws)
  ws.on('message', msg => {
    console.log(msg)
    // 广播消息
    clients.forEach(item => {
      if(item === ws) {
        item.send(msg);
      }
    })
  });

  // ws.send(JSON.stringify(wsData));
  // 连接关闭时，将其移出连接池
        
  ws.on('close', msg => {
    clients = clients.filter(item => (item !== ws))
  })

});





// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
