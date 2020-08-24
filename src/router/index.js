import Vue from 'vue';
import VueRouter from 'vue-router';

import home from '../home'
import login from '../login'

Vue.use(VueRouter);

let rootRouters = [];
let configRouters = [];

// 获取一级路由
const rootFiles = require.context('@/view', false, /\.vue$/)

// 获取二级子路由
const files = require.context('@/view', true, /index.js$/)
// console.log(files.keys()) // ["./home.js"] 返回一个数组

files.keys().forEach(key => {
    if (key === './index.js') return
    configRouters = configRouters.concat(files(key).routes) // 读取出文件中的default模块
})

rootFiles.keys().forEach(key => {
    const fileName = validateFileName(key);
    rootRouters.push({
        name: fileName,
        path: `/${fileName}`,
        component: rootFiles(key).default
    }) // 读取出文件中的default模块
})

configRouters = configRouters.concat(rootRouters);

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/login',
        component: login
    },
    {
        path: '/home',
        component: home,
        children: configRouters
    }
];

const router = new VueRouter({
    // mode:'history',
    routes: routes
})

router.beforeEach((to, from, next) => {

    next() // 确保一定要调用 next()
});

function validateFileName(str) {
    return /^\S+\.vue$/.test(str) && str.replace(/^\S+\/(\w+)\.vue$/, '$1')
}

export default router;