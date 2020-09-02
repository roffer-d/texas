// 路径   mock/index.js
const express = require("express"); //引入express模块
const app = express(); //实例化express
const bodyParser = require("body-parser");
const helper = require("../utils/dbHelper")
const response = require("../utils/response")
const jwt = require('jsonwebtoken');
const constant = require('../utils/Constant')
const socket = require("../websocket")
const baseUrl = constant.BASE_API
const multer = require("multer");
const fs = require('fs');
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

function getUserByToken(token) {
    jwt.verify(token, constant.TOKEN_PRIVATE_KEY, (err, r) => {
        let query = {
            _id: ObjectId(r.userId)
        }

        helper.find('texas', 'users', query).then(array => {
            let user = array.length ? array[0] : {}
            socket.sendMsg({type: 'join', user})
        })
    })
}

function out(token) {
    jwt.verify(token, constant.TOKEN_PRIVATE_KEY, (err, r) => {
        let query = {
            _id: ObjectId(r.userId)
        }
        helper.find('texas', 'users', query).then(array => {
            let user = array.length ? array[0] : {}
            socket.sendMsg({type: 'out', user})
        })
    })
}

socket.onMessage = (msg) => {
    let json = JSON.parse(msg)
    let {type, token} = json

    switch (type) {
        case 'join':
            getUserByToken(token)
            break;
        case 'out':
            out(token)
            break;
    }
}

socket.close = (token) => {
    out(token)
}

// app.use(bodyParser());

app.use(bodyParser.json({limit: '10mb'})); // for parsing application/json
app.use(bodyParser.urlencoded({limit: '10mb', extended: true })); // for parsing application/x-www-form-urlencoded

/*为app添加中间件处理跨域请求*/
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// 文件上传请求处理，upload.array 支持多文件上传，第二个参数是上传文件数目
app.post(`${baseUrl}/upload`, upload.array('file', 1), function (req, res) {
    // 读取上传的图片信息
    let files = req.files;

    if(!files[0]) {
        res.json(response.fail('上传失败',500))
    } else {
        res.json(response.success({url: `http://file.lonhey.com/${files[0].path.replace(/\\/g,'/')}`}))
    }
});

app.post(`${baseUrl}/userInfo`, (req, res) => {
    let token = req.headers.token
    if (token) {
        jwt.verify(token, constant.TOKEN_PRIVATE_KEY, (err, r) => {
            if (err) {
                res.json(response.fail('登录已失效！', 401))
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
    } else {
        res.json(response.fail('未登录！', 401))
    }
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
        console.log(data)
        res.json(response.success(data))
    })
})

app.post(`${baseUrl}/deleteUser`, (req, res) => {
    let userId = req.body.userId

    let where = {_id:ObjectId(userId)}

    helper.del('texas', 'users', where,true).then(data => {
        console.log(data)
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
                res.json(response.fail('账号已在其它地方登陆', 502))
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