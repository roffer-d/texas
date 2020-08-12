const response = {
    success(data, msg) {
        let res = {
            code: 200,
            msg: msg || 'success',
            data
        }

        return res
    },
    fail(msg, code) {
        let res = {
            code: code || 500,
            msg: msg || 'fail'
        }

        return res
    }
}

module.exports = response