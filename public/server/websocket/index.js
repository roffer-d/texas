const constant = require('../utils/Constant')
const WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: constant.SOCKET_PORT});//服务端口8181

let socket = {
    ws:null,
    sendMsg(data){
        if (this.ws.readyState == 1) {
            this.ws.send(JSON.stringify(data)); //需要将对象转成字符串。WebSocket只支持文本和二进制数据,推送消息
            console.log('已发送socket信息：',JSON.stringify(data))
        }
    },
    onMessage(msg){
        console.log('收到客户端推送消息：',msg);
    },
    close(){
        console.log('websocket server closed')
    }
}

wss.on('connection', function (ws) {
    console.log('服务端：客户端已连接');

    socket.ws = ws

    ws.on('message', socket.onMessage);
    ws.on('close', socket.close);
});

console.log(`websocket server started.\n\tport:${constant.SOCKET_PORT}`)

module.exports = socket
