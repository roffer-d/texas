<template>
    <div>
        <van-uploader v-model="fileList" :after-read="afterRead" />
    </div>
</template>

<script>
    export default {
        name: "userAdd",
        data(){
            return {
                fileList: [
                    {
                        url: 'https://img.yzcdn.cn/vant/leaf.jpg',
                        status: 'uploading',
                        message: '上传中...',
                    },
                    {
                        url: 'https://img.yzcdn.cn/vant/tree.jpg',
                        status: 'failed',
                        message: '上传失败',
                    },
                ],
            }
        },
        mounted() {

        },
        methods:{
            afterRead(file) {
                file.status = 'uploading';
                file.message = '上传中...';

                setTimeout(() => {
                    file.status = 'failed';
                    file.message = '上传失败';
                }, 1000);
            }
        }
    }
</script>

<style scoped>

</style>