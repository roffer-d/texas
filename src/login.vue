<template>
    <div class="login" ref="login">
        <div class="form">
            <img :src="heads[who]" class="head"/>
            <div class="item">
                <input type="text" @blur="usernameBlur" v-model="form.username"/>
            </div>
            <div class="item">
                <input type="password" v-model="form.password" />
            </div>
            <div class="submit" @click="login">登录</div>
        </div>
    </div>
</template>

<script>
    import md5 from 'md5-node'
    import defaultImg from './assets/images/default.jpg'
    import roffer from './assets/images/roffer.jpeg'
    import lm from './assets/images/lm.jpeg'
    import mxc from './assets/images/mxc.jpeg'
    import wyb from './assets/images/wyb.jpeg'
    import wyh from './assets/images/wyh.jpeg'
    import xj from './assets/images/xj.jpeg'
    import zf from './assets/images/zf.jpeg'

    export default {
        name: "login",
        data() {
            return {
                heads: {roffer, lm, mxc, wyb, wyh, xj, zf,defaultImg},
                who: 'defaultImg',
                userList: [],
                form: {
                    username: '',
                    password: ''
                }
            }
        },
        created() {
            this.getUserList()
        },
        mounted() {

        },
        methods: {
            usernameBlur() {
                if (this.form.username) {
                    let index = this.userList.findIndex(item => item.username === this.form.username)
                    if (index !== -1) {
                        this.who = this.userList[index].username
                    }
                }
            },
            async getUserList() {
                let res = await this.http.post('/api/userList')
                this.userList = res.data
            },
            async login(){
                let params = {...this.form}
                params.password = md5(params.password)

                let res = await this.http.post('/api/login',params)
                delete res.data.password
                localStorage.setItem('user',JSON.stringify(res.data))
                this.$router.push('/home')
            }
        }
    }
</script>

<style scoped lang="less">
    @keyframes bgAnimate {
        from {
            background: url("./assets/images/bg1.jpeg") no-repeat;
            background-size: 100% 100%;
        }
        to {
            background: url("./assets/images/bg2.jpeg") no-repeat;
            background-size: 100% 100%;
        }
    }

    .login {
        width: 100%;
        height: 100vh;
        animation: bgAnimate 3s infinite alternate;
        display: flex;

        .form{
            width: 90%;
            height: 30%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin: auto;
            background: rgba(0,0,0,.3);

            .head{
                width: 3rem;
                height: 3rem;
                border-radius: 50%;
            }
            .item{

            }
        }
    }
</style>