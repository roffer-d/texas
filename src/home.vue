<template>
    <div class="main">

    </div>
</template>

<script>
    import socket from "./global/socket";

    export default {
        name: "index",
        data() {
            return {
                user:null,
            }
        },
        created() {
            let token = localStorage.getItem('token')

            if (!token) {
                this.$router.push('/login')
            }else{
                let user = localStorage.getItem('user')
                user = JSON.parse(user)

                this.websocket = new socket(`125.64.98.29:8181/texas?uid=${user._id}&token=${token}`)
                this.websocket.addCallback('join', this.join)
                this.websocket.addCallback('out', this.out)

                this.websocket.send({type: 'join', token})
            }
        },
        mounted() {
            window.addEventListener('beforeunload', this.closeWindow)
            this.getData()
        },
        methods: {
            closeWindow(){
                // let token = localStorage.getItem('token')
                // this.websocket.send({type: 'out', token})
            },
            async getData() {
                this.user = await this.http.post('/api/userInfo')
            },
            join(data) {
                console.log(`用户【${data.user.username}】加入了战斗`)
            },
            out(data) {
                console.log(`用户【${data.user.username}】退出了战斗`)
            }
        }
    }
</script>

<style scoped lang="less">
    .main{
        /*background: url("./assets/images/bg1.jpeg");*/
        background: #3781b0;
        background-size: 100% 100%;
        height: 100vh;
        width: 100%;
    }
</style>