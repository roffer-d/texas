<template>
    <div class="main">
        <div v-for="item in onlineUsers" :key="item._id">{{item.username}}</div>
    </div>
</template>

<script>
    import socket from "./global/socket";
    import constant from "../public/server/utils/Constant";
    import {mapGetters,mapActions} from 'vuex'

    export default {
        name: "index",
        data() {
            return {
                user: null,
                onlineUsers:[]
            }
        },
        computed:{
            ...mapGetters({
                userList:'common/userList'
            })
        },
        created() {
            let token = localStorage.getItem('token')

            if (!token) {
                this.$router.push('/login')
            } else {
                let user = localStorage.getItem('user')
                user = JSON.parse(user)

                this.websocket = new socket(`${constant.SOCKET_HOST}:${constant.SOCKET_PORT}/texas?uid=${user._id}&token=${token}`)
                this.websocket.addCallback('join', this.join)
                this.websocket.addCallback('out', this.out)
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            ...mapActions({
                updateUserList:'common/updateUserList'
            }),
            async getData() {
                // this.user = await this.http.post('/api/userInfo')
                this.user = JSON.parse(localStorage.getItem('user'))
            },
            async join(data) {
                let list = this.userList

                if(!list.length){
                    let res = await this.updateUserList()
                    list = res.data
                }

                let user = this.userList.find(u=>{return u._id === data.userId})
                console.log(`玩家【${user.username}】加入`)

                let onlineUserIds = data.onlineUsers.join(',')
                this.onlineUsers = list.filter(item=>onlineUserIds.indexOf(item._id) !== -1)
            },
            async out(data) {
                let list = this.userList

                if(!list.length){
                    let res = await this.updateUserList()
                    list = res.data
                }

                let user = this.userList.find(u=>{return u._id === data.userId})
                console.log(`玩家【${user.username}】退出`)

                let onlineUserIds = data.onlineUsers.join(',')
                this.onlineUsers = list.filter(item=>onlineUserIds.indexOf(item._id) !== -1)
            }
        }
    }
</script>

<style scoped lang="less">
    .main {
        /*background: url("./assets/images/bg1.jpeg");*/
        background: #3781b0;
        background-size: 100% 100%;
        height: 100vh;
        width: 100%;
    }
</style>