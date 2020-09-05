const qs = require('qs');
const constant = require('../utils/constant')
const status = require('../utils/status')
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


    let conn = socket.connections[_id]
    let sta = conn && conn.status === status.GAME.LEAVE
                /** 获取连接池中是否有当前连接的玩家，如果有，表示该玩家在对局中离开，此时应该恢复他的对局数据 **/
                ? status.GAME.LEAVE
                /** 新进来的玩家 **/
                : status.GAME.NORMAL

    socket.connections[_id] = {token,ws,status:sta}

    ws.on('message', socket.onMessage);
    ws.on('close', ()=>{
        socket.close(_id)
    });

    socket.connected(_id)
});

console.log(`websocket server started.\n\tport:${constant.SOCKET_PORT}`)

module.exports = socket
