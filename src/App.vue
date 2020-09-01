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
            this.updateUserList()
        },
        methods: {
            ...mapActions({
                updateUserList:'common/updateUserList'
            })
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