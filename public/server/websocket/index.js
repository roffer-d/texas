const WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 8181});//服务端口8181
wss.on('connection', function (ws) {
    console.log('服务端：客户端已连接');

    const sendMsg = function (ws) {
        if (ws.readyState == 1) {
            let data = {
                type: 'home',
                msg: 'server response'
            }
            ws.send(JSON.stringify(data)); //需要将对象转成字符串。WebSocket只支持文本和二进制数据,推送消息
        }
    }

    //每三秒发送一次
    let interval = null
    // interval = setInterval(function () {
        sendMsg(ws);
    // }, 3000)

    ws.on('message', function (message) {
        //打印客户端监听的消息
        console.log(message);
    });
    ws.on('close', function () {
        interval && clearInterval(interval)
        console.log('websocket server closed')
    });
});

console.log('websocket server started.\n\tport:8181')