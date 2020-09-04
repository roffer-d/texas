const qs = require('qs');
const constant = require('../utils/constant')
const WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: constant.SOCKET_PORT});//服务端口8181

let socket = {
    connections:{},
    sendMsg(data){
        for(let key in this.connections){
            let item = this.connections[key]
            if (item.ws.readyState == 1) {
                item.ws.send(JSON.stringify(data)); //需要将对象转成字符串。WebSocket只支持文本和二进制数据,推送消息
                console.log('已发送socket信息：',JSON.stringify(data))
            }
        }
    },
    onMessage(msg){
        console.log('收到客户端推送消息：',msg);
    },
    connected(prarms){

    },
    close(prarms){

    }
}

wss.on('connection', function (ws,req) {
    console.log('服务端：客户端已连接');

    let url = req.url;
    let prarms = qs.parse(url.split('?')[1]); // uid=xxxxxx
    prarms = JSON.parse(JSON.stringify(prarms))
    let {_id,token} = prarms

    socket.connections[_id] = {token,ws}

    ws.on('message', socket.onMessage);
    ws.on('close', ()=>{
        delete socket.connections[_id]
        socket.close(_id)
    });

    socket.connected(_id)
});

console.log(`websocket server started.\n\tport:${constant.SOCKET_PORT}`)

module.exports = socket
