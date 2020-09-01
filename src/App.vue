<template>
    <div>
        <router-view/>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'

    export default {
        name: "index",
        data() {
            return {

            }
        },
        created() {

        },
        mounted() {
            this.getUserList()
        },
        methods: {
            ...mapActions({
                updateUserList:'common/updateUserList'
            }),
            async getUserList() {
                let res = await this.http.post('/api/userList')
                this.updateUserList(res.data)
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