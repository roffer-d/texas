<template>
    <div>
        <router-view/>
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

                this.websocket = new socket(`125.64.98.29:8181/texas?uid=${user._id}`)
                this.websocket.addCallback('join', this.join)
                this.websocket.addCallback('out', this.out)

                this.websocket.send({type: 'join', token})
            }
        },
        mounted() {
            window.addEventListener('beforeunload', () => {
                let token = localStorage.getItem('token')
                this.websocket.send({type: 'out', token})
            })

            this.getData()
        },
        methods: {
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

<style scoped>

</style>