<template>
    <div>
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                user:null,
            }
        },
        created() {

        },
        mounted() {
            this.getData()
        },
        methods: {
            async getData() {
                this.user = await this.http.post('/api/userInfo')
            },
        }
    }
</script>

<style scoped>

</style>