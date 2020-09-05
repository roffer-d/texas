const game = require('../utils/game')
const socket = require("../websocket")
const status = require('../utils/status')

function ready(userId) {
    socket.connections[userId].ready = true;

    let count = Object.keys(socket.connections).length
    let readyCount = 0
    let pokerList = []

    for (let key in socket.connections) {
        if (socket.connections[key].ready) {
            readyCount = readyCount + 1
        }
    }

    //所有玩家都准备就绪(至少2个人)，生成初始3张底牌
    if (count >= 2 && count === readyCount) {
        game.start()
        pokerList = game.pokerList
    }

    socket.sendMsg({
        type: 'ready',
        userId: userId,
        gameInfo: {
            isStart:pokerList.length ? true : false,
            pokerList,
            dinerForUserIndex: 0
        }
    })
}

socket.onMessage = (msg) => {
    let json = JSON.parse(msg)
    let {type, userId} = json

    switch (type) {
        case 'ready':
            ready(userId)
            break;
    }
}

socket.connected = (_id) => {
    let onlineUsers = Object.keys(socket.connections)
    let conn = socket.connections[_id]

    if (conn.status === status.GAME.LEAVE) {
        socket.sendMsg({type: 'reconnect', userId: _id, pokerList: game.pokerList, onlineUsers})
        conn.status = status.GAME.IN_PROGRESS
    } else {
        socket.sendMsg({type: 'join', userId: _id, onlineUsers})
    }
}

socket.close = (_id) => {
    if (!game.isStart) {
        //对局未开始离开，直接删除连接状态
        delete socket.connections[_id]
    } else {
        //对局进行中离开，标记当前玩家离线
        socket.connections[_id].status = status.GAME.LEAVE
    }

    let onlineUsers = Object.keys(socket.connections)
    socket.sendMsg({type: 'out', userId: _id, onlineUsers})
}

module.exports = socket