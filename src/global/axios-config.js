/**
 * ajax请求配置
 */
import axios from 'axios'
import status from '../../public/server/utils/status'
import qs from 'qs'
import {Toast} from 'vant'

// axios默认配置
axios.defaults.timeout = status.TIMEOUT;          // 超时时间
axios.defaults.baseURL = '/';  // 默认地址
//**整理数据格式**
axios.defaults.transformRequest = function (data) {
    return qs.stringify(data);
};

// **路由请求拦截**
// http request 拦截器
axios.interceptors.request.use(
    config => {

        let token = localStorage.getItem("token")
        if (token) {
            config.headers['token'] = token
        }

        return config;

    },
    error => {
        return Promise.reject(error.response);
    }
)

// **路由响应拦截**
// http response 拦截器
axios.interceptors.response.use(
    response => {

        let data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data
        response.data = data

        let {code} = data;

        if(code != status.SUCCESS){
            let message = data.msg
            Toast(message)

            switch (code) {
                case status.ERRORS.NOT_LOGIN.code:
                    window.location.pathname !== '/login' && (location.href = '/login')
                    break;
                case status.ERRORS.OTHER_LOGIN.code:
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                    window.location.pathname !== '/login' && (location.href = '/login')
                    break;
            }

            const error = new Error(message)
            error.data = data
            error.response = response
            throw error
        }

        return data
    },
    error => {
        if(error.response && error.response.data){
            let data = error.response.data
            data = typeof data === 'string' ? data : JSON.stringify(data)
            if(data.indexOf('code=401') !== -1){//登录超时
                location.href = '/login'
            }
        }else if(error.message === `timeout of ${status.TIMEOUT}ms exceeded`){
            Toast("请求超时！")
        }
        return Promise.reject(error)   // 返回接口返回的错误信息
    }
)

export default axios;
