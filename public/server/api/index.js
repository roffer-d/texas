// 路径   mock/index.js
const express = require("express"); //引入express模块
const app = express(); //实例化express
const bodyParser = require("body-parser");
const helper = require("../utils/dbHelper")
const response = require("../utils/response")

const baseUrl = '/api'

app.use(bodyParser());

/*为app添加中间件处理跨域请求*/
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// 设置get请求
app.post(`${baseUrl}/index`, (req, res) => {
    helper.find('texas', 'users').then(data => {
        res.json(response.success(data))
    })
})

app.post(`${baseUrl}/userList`, (req, res) => {
    let query = {}
    let filter = {
        password:0,
        _id:0
    }
    helper.find('texas', 'users',query,filter).then(data => {
        res.json(response.success(data))
    })
})

app.post(`${baseUrl}/saveUser`, (req, res) => {
    let user = req.body.user

    helper.save('texas', 'users', user).then(data => {
        console.log(data)
        res.json(response.success(data))
    })
})

app.post(`${baseUrl}/updateUser`, (req, res) => {
    let username = req.body.username

    let where = {username}
    let update = {$set:{username:'test111'}}

    helper.update('texas', 'users', where,update,true).then(data => {
        console.log(data)
        res.json(response.success(data))
    })
})

app.post(`${baseUrl}/deleteUser`, (req, res) => {
    let username = req.body.username

    let where = {username}

    helper.del('texas', 'users', where,true).then(data => {
        console.log(data)
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
            if(user.status != 0){
                res.json(response.fail('账号已在其它地方登陆', 502))
            }
            res.json(response.success(data[0]))
        } else {
            res.json(response.fail('账号或密码错误', 501))
        }
    })
});

/**
 * 监听8090端口
 */
app.listen("8090");

console.log("Api server started\n\tport:8090")