// 路径   mock/index.js
const express = require("express"); //引入express模块
const app = express(); //实例化express
const bodyParser = require("body-parser");
const helper = require("../utils/dbHelper")
const response = require("../utils/response")
const jwt = require('jsonwebtoken');
const constant = require('../utils/constant')
const status = require('../utils/status')
const game = require('../utils/game')
const socket = require("../websocket")
const baseUrl = constant.BASE_API
const multer = require("multer");
// const fs = require('fs');
const ObjectId = require('mongodb').ObjectId

// 设置图片存储路径
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images');
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})
// 添加配置文件到muler对象。
const upload = multer({ storage: storage });
app.use(express.static('/images'));

// app.use(bodyParser());

app.use(bodyParser.json({limit: '10mb'})); // for parsing application/json
app.use(bodyParser.urlencoded({limit: '10mb', extended: true })); // for parsing application/x-www-form-urlencoded

/*为app添加中间件处理跨域请求*/
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    if(req.headers.referer.indexOf('/login') !== -1){
        next()
    }else{
        let token = req.headers.token
        jwt.verify(token, constant.TOKEN_PRIVATE_KEY, (err, r) => {
            if(err){
                res.json(response.fail(status.ERRORS.NOT_LOGIN.message, status.ERRORS.NOT_LOGIN.code))
            }
            //已再其它端登录
            // else if (socket.connections[r.userId] && token !== socket.connections[r.userId].token) {
            //     res.json(response.fail(status.ERRORS.OTHER_LOGIN.message, status.ERRORS.OTHER_LOGIN.code))
            // }
            next();
        })
    }
})

function ready(userId){
    socket.connections[userId].ready = true;

    let count = Object.keys(socket.connections).length
    let readyCount = 0
    let pokerList = []

    for(let key in socket.connections){
        if(socket.connections[key].ready){
            readyCount = readyCount +1
        }
    }

    //所有玩家都准备就绪(至少2个人)，生成初始3张底牌
    if(count >= 2 && count === readyCount){
        game.start()
        pokerList = game.pokerList
    }

    socket.sendMsg({type: 'ready', userId:userId,pokerList})
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

    if(conn.status === status.GAME.LEAVE){
        socket.sendMsg({type: 'reconnect', userId:_id,pokerList:game.pokerList,onlineUsers})
        conn.status = status.GAME.IN_PROGRESS
    }else{
        socket.sendMsg({type: 'join', userId:_id,onlineUsers})
    }
}

socket.close = (_id) => {
    if(!game.isStart){
        //对局未开始离开，直接删除连接状态
        delete socket.connections[_id]
    }else{
        //对局进行中离开，标记当前玩家离线
        socket.connections[_id].status = status.GAME.LEAVE
    }

    let onlineUsers = Object.keys(socket.connections)
    socket.sendMsg({type: 'out', userId:_id,onlineUsers})
}

// 文件上传请求处理，upload.array 支持多文件上传，第二个参数是上传文件数目
app.post(`${baseUrl}/upload`, upload.array('file', 1), function (req, res) {
    // 读取上传的图片信息
    let files = req.files;

    if(!files[0]) {
        res.json(response.fail(status.ERRORS.UPLOAD_FAIL.message, status.ERRORS.UPLOAD_FAIL.code))
    } else {
        res.json(response.success({url: `http://file.lonhey.com/${files[0].path.replace(/\\/g,'/')}`}))
    }
});

app.post(`${baseUrl}/userInfo`, (req, res) => {
    let token = req.headers.token
    jwt.verify(token, constant.TOKEN_PRIVATE_KEY, (err, r) => {
        if (err) {
            res.json(response.fail(status.ERRORS.NOT_LOGIN.message, status.ERRORS.NOT_LOGIN.code))
        } else {
            let query = {
                _id: r.userId
            }
            helper.find('texas', 'users', query).then(array => {
                let data = array.length ? array[0] : {}
                res.json(response.success(data))
            })
        }
    })
})

app.post(`${baseUrl}/findUser`, (req, res) => {
    let userId = req.body.userId
    let query = {
        _id:ObjectId(userId)
    }

    helper.find('texas', 'users', query).then(array => {
        let data = array.length ? array[0] : {}
        res.json(response.success(data))
    })
})

app.post(`${baseUrl}/saveUser`, (req, res) => {
    let user = req.body.user

    helper.save('texas', 'users', user).then(data => {
        res.json(response.success())
    })
})

app.post(`${baseUrl}/updateUser`, (req, res) => {
    let user = req.body.user

    let where = {_id:ObjectId(user._id)}

    delete user._id
    let update = {$set:user}

    helper.update('texas', 'users', where,update,true).then(data => {
        res.json(response.success(data))
    })
})

app.post(`${baseUrl}/deleteUser`, (req, res) => {
    let userId = req.body.userId

    let where = {_id:ObjectId(userId)}

    helper.del('texas', 'users', where,true).then(data => {
        res.json(response.success(data))
    })
})

app.post(`${baseUrl}/userList`, (req, res) => {
    let query = {}
    let filter = {
        // password: 1,
        // _id: 1
    }
    helper.find('texas', 'users', query, filter).then(data => {
        res.json(response.success(data))
    })
})

// 设置接口
app.post(`${baseUrl}/login`, (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    helper.find('texas', 'users', {username, password}).then(data => {
        if (data && data.length) {
            let user = data[0]
            if (socket.connections[user._id]) {
                res.json(response.fail(status.ERRORS.OTHER_LOGIN.message, status.ERRORS.OTHER_LOGIN.code))
            }
            helper.update('texas', 'users', {username, password}, {$set: {last_login_time: new Date()}}).then(d => {
                let token = jwt.sign({userId: user._id}, constant.TOKEN_PRIVATE_KEY, {expiresIn: constant.TOKEN_EXPIRESIN})
                let resData = {user, token}

                socket.sendMsg({type: 'join', user})

                res.json(response.success(resData))
            })
        } else {
            res.json(response.fail('账号或密码错误', 501))
        }
    })
});

/**
 * 监听8090端口
 */
app.listen(`${constant.SERVER_PORT}`);

console.log(`Api server started\n\tport:${constant.SERVER_PORT}`)