/**
 * ajax请求配置
 */
import axios from 'axios'
import constant from './constant'
import qs from 'qs'
import {Toast} from 'vant'

// axios默认配置
axios.defaults.timeout = constant.TIMEOUT;          // 超时时间
axios.defaults.baseURL = '/';  // 默认地址
//**整理数据格式**
axios.defaults.transformRequest = function (data) {
    return qs.stringify(data);
};

// **路由请求拦截**
// http request 拦截器
axios.interceptors.request.use(
    config => {

        // let user = localStorage.getItem("userInfo")
        // if (user) {
        //     let sessionId = JSON.parse(user).sessionId
        //     config.headers['sessionId'] = sessionId
        // }

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
        if (data.code != constant.SUCCESS) {
            let message = response.data.msg

            Toast(message)

            if(data.code == constant.ERRORS.NOT_LOGIN){
                //未登录,跳转到登录页
                location.href = '/login'
            }

            const error = new Error(message)
            error.data = data
            error.response = response
            throw error
        }

        return response.data;
    },
    error => {
        if(error.response && error.response.data){
            let data = error.response.data
            data = typeof data === 'string' ? data : JSON.stringify(data)
            if(data.indexOf('code=401') !== -1){//登录超时
                location.href = '/login'
            }
        }else if(error.message === `timeout of ${constant.TIMEOUT}ms exceeded`){
            Toast("请求超时！")
        }
        return Promise.reject(error)   // 返回接口返回的错误信息
    }
)

export default axios;
