<template>
    <div class="login" ref="login">
        <div class="form">
            <img :src="head" class="head"/>
            <div class="item">
                <span class="iconfont icon-username"></span>
                <input type="text" @blur="usernameBlur" v-model="form.username"/>
            </div>
            <div class="item">
                <span class="iconfont icon-password"></span>
                <input type="password" v-model="form.password"/>
            </div>
            <div class="submit" @click="login">登录</div>
        </div>
    </div>
</template>

<script>
    import md5 from 'md5-node'
    import defaultImg from './assets/images/default.jpg'
    import {mapGetters} from 'vuex'

    export default {
        name: "login",
        data() {
            return {
                head:defaultImg,
                form: {
                    username: '',
                    password: ''
                }
            }
        },
        computed:{
            ...mapGetters({
                userList:'common/userList'
            })
        },
        mounted() {

        },
        methods: {
            usernameBlur() {
                if (this.form.username) {
                    let index = this.userList.findIndex(item => item.username === this.form.username)
                    if (index !== -1) {
                        this.head = this.userList[index].head
                    }else{
                        this.head = defaultImg
                    }
                }
            },
            async login() {
                let params = {...this.form}
                params.password = md5(params.password)

                let res = await this.http.post('/api/login', params)
                localStorage.setItem('user', JSON.stringify(res.data.user))
                localStorage.setItem('token', res.data.token)
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

        .form {
            width: 90%;
            height: 40%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin: auto;
            background: rgba(0, 0, 0, .3);

            .head {
                width: 3rem;
                height: 3rem;
                border-radius: 50%;
                margin-bottom: 1.5rem;
            }

            .item {
                margin-bottom: 1.5rem;
                position: relative;

                .iconfont{
                    color: #c1b397;
                    font-size: 1.4rem;
                    position: absolute;
                    top: .3rem;
                    left:.2rem;
                }

                input {
                    border: none;
                    outline: none;
                    border-radius: .2rem;
                    height: 2rem;
                    background: rgba(255, 255, 255, .7);
                    color: #555;
                    padding:.1rem .3rem .1rem 1.8rem;
                }
            }

            .submit{
                color: #fff;
                border-radius: 0.2rem;
                background: rgba(56,244,255,.6);
                padding: .3rem 2rem;
            }
        }
    }
</style>