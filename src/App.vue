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
            return {}
        },
        created() {
            let token = localStorage.getItem('token')
            if (!token) {
                this.$router.push('/login')
            }

            this.websocket = new socket('localhost:8181')
            this.websocket.addCallback('join', this.join)
            this.websocket.addCallback('out', this.out)

            this.websocket.send({type: 'join', token})
        },
        mounted() {
            window.addEventListener('beforeunload', () => {
                let token = localStorage.getItem('token')
                this.websocket.send({type: 'out', token})
            })
        },
        methods: {
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
    html, body {
        font-size: 50px;
        padding: 0;
        margin: 0;
    }
</style>