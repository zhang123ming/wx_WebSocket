const http = require('http');
var num=0;
// 引入websocket
const WebSocketServer = require('websocket').server;
// 创建一个http  serve
const httpServer = http.createServer((request, response) => {
  response.writeHead(404);
  response.end();
})
// 创建一个websocket  server
const wxServer = new WebSocketServer({
  httpServer,
  autoAcceptConnections: true
})

// 事件监听
wxServer.on('connect', connection => {
  connection.on("message", message => {
    // 用于监听是否能够接收到message信息
    console.log("message===>", message);
    if (message.type === 'utf8') {
      num++;
      var data = {
        content: '自动回复   '+num,
        data: new Date()
      };
      // 服务器返回的信息
      connection.sendUTF(JSON.stringify(data));
    }
  })
  // 连接的关闭监听
  connection.on('close', (reasonCode, description) => {
    console.log('[' + new Date() + ']peer' + connection.remoteAddress + 'disconnected')
  })

  // 接收控制台中的输入
  process.stdin.on('data', function(data) {
    var data = data.toString().trim();
    data = {
      'content': data,
      'date': '2010-01-01'
    }
    connection.sendUTF(JSON.stringify(data))
  })

})
httpServer.listen(3000, () => {
  console.log('[' + new Date() + '] server is listening on post 3000')
})