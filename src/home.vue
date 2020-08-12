<template>
    <div>
        <router-view/>
    </div>
</template>

<script>
    import {mapActions, mapMutations, mapGetters} from 'vuex'
    import socket from './global/socket'
    import md5 from 'md5-node'

    export default {
        name: "index",
        computed: {
            ...mapGetters({
                //使用带名字空间store
                data: 'common/data',
            })
        },
        data() {
            return {
                websocket: null
            }
        },
        created() {
            this.websocket = new socket('localhost:8181')
            this.websocket.addCallback('home', this.onHomeMsg)
            this.websocket.send({msg: 'test'})
        },
        mounted() {
            this.update(this.data.concat([{id: 2, name: 'test2'}]))
            this.getData()
        },
        methods: {
            ...mapActions({
                update: 'common/updateData', // 将 `this.update()` 映射为 `this.$store.dispatch('updateData')`
            }),
            onHomeMsg(data) {
                console.log(data)
            },
            async getData() {
                // let get = await this.http.post('/api/index')
                // console.log(get)
                //
                // let login = await this.http.post('/api/login', {username: 'roffer', password: md5('roffer.2020')})
                // console.log(login)

                // let data = {user:{username: 'zyf', password: md5('zyf123'), status: 0}}
                // let data = {
                //     // user:{username: 'zyf', password: md5('zyf123'), status: 0}
                //     user:[
                //         {username: 'aaa', password: md5('123456'), status: 0},
                //         {username: 'bbb', password: md5('123456'), status: 0}
                //     ]
                // }
                // let save = await this.http.post('/api/saveUser', data)
                // console.log(save)

                // let update = await this.http.post('/api/updateUser', {username:'aaa'})
                // console.log(update)

                // let del = await this.http.post('/api/deleteUser', {username:'test111'})
                // console.log(del)
            },
        }
    }
</script>

<style scoped>

</style>