const status = {
    SUCCESS:'200',
    TIMEOUT:5000,
    ERRORS:{
        NOT_LOGIN:{code:'A_101',message:'登录失效！'},
        OTHER_LOGIN:{code:'A_102',message:'该账号已在其它端登录！'},
        UPLOAD_FAIL:{code:'A_103',message:'上传错误！'},
    },
    GAME:{
        NORMAL: '0',//连接状态
        IN_PROGRESS:'1',//对局中
        LEAVE:'2',//对局中离开
    }
}

module.exports = status