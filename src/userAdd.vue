<template>
    <div class="user-add">
        <van-nav-bar
                title="添加玩家"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"
        />
        <van-form @submit="onSubmit">
            <van-field
                    v-model="form.username"
                    name="用户名"
                    label="用户名"
                    placeholder="用户名"
                    :rules="[{ required: true, message: '请填写用户名' }]"
            />
            <van-field
                    v-model="form.nikename"
                    name="真实姓名"
                    label="真实姓名"
                    placeholder="真实姓名"
                    :rules="[{ required: true, message: '请填写真实姓名' }]"
            />
            <van-field
                    v-model="form.password"
                    type="password"
                    name="密码"
                    label="密码"
                    placeholder="密码"
                    :rules="[{ required: true, message: '请填写密码' }]"
            />
            <van-field name="head" label="头像">
                <template #input>
                    <div class="head-img" v-if="form.head">
                        <span class="delete" @click="form.head = ''"></span>
                        <img :src="form.head"/>
                    </div>
                    <van-uploader :after-read="afterRead" />
                </template>
            </van-field>
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">
                    提交
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
    import md5 from 'md5-node'

    export default {
        name: "userAdd",
        data(){
            return {
                form:{
                    username:'',
                    password:'',
                    nikename:'',
                    status:0,
                    head:'',
                }
            }
        },
        mounted() {

        },
        methods:{
            onClickLeft() {
                this.$router.go(-1);
            },
            onSubmit(values) {
                if(!this.form.head){
                    this.$toast('请上传头像')
                    return
                }

                let params = {...this.form}
                params.password = md5(params.password)

                this.http.post('/api/saveUser',{user:params}).then(res=>{
                    this.form = {
                        username:'',
                        password:'',
                        nikename:'',
                        status:0,
                        head:'',
                    }
                    this.$toast('添加成功')
                })
            },
            afterRead(file) {
                file.status = 'uploading';
                file.message = '上传中...';

                let formData = new FormData()
                formData.append('file',file.file)
                let headers = { 'Content-Type': 'multipart/form-data' }

                this.http.post('/api/upload',formData,
                    {
                        headers,
                        transformRequest: [function (data) {
                            return data
                        }],
                    }
                ).then(res=>{
                    this.form.head = res.data.url
                    file.status = 'success';
                    file.message = '上传成功';
                }).catch(e=>{
                    console.log(e)
                    file.status = 'failed';
                    file.message = '上传失败';
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .user-add{
        .head-img{
            position: relative;
            .delete{
                &:after{
                    content: 'x';
                    position: absolute;
                    right: 1rem;
                    top: 0;
                    font-size: 1.2rem;
                    color:#c32026;
                    cursor: pointer;
                }
            }
            img{
                width: 5rem;
                height: 5rem;
                margin: 0 1rem 0 0;
                border-radius: 50%;
            }
        }
    }
</style>