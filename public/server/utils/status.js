const status = {
    SUCCESS:'200',
    TIMEOUT:5000,
    ERRORS:{
        NOT_LOGIN:{code:'A_101',message:'登录失效！'},
        OTHER_LOGIN:{code:'A_102',message:'该账号已在其它端登录！'},
        UPLOAD_FAIL:{code:'A_103',message:'上传错误！'},
    }
}

module.exports = status