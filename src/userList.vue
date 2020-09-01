<template>
    <div class="user-list">
        <van-nav-bar
                title="玩家信息"
                left-text="返回"
                right-text="添加"
                left-arrow
                @click-left="onClickLeft"
                @click-right="onClickRight"
        />
        <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
        >
            <template v-for="item in userList">
                <van-swipe-cell :key="item._id">
                    <van-cell>
                        <div class="user-item">
                            <img :src="item.head" />
                            <span>{{item.username}}</span>
                        </div>
                    </van-cell>
                    <template #right>
                        <van-button square type="danger" text="删除" @click="delUser(item)"/>
                        <van-button square type="primary" text="编辑" @click="editUser(item)"/>
                    </template>
                </van-swipe-cell>
            </template>
        </van-list>
    </div>
</template>

<script>
    import {mapGetters,mapActions} from 'vuex'

    export default {
        name: "userList",
        data(){
            return {
                loading: false,
                finished: true,
            }
        },
        computed:{
            ...mapGetters({
                userList:'common/userList'
            })
        },
        mounted() {
            this.updateUserList()
        },
        methods:{
            ...mapActions({
                updateUserList:'common/updateUserList'
            }),
            delUser(user){
                this.http.post('/api/deleteUser',{userId:user._id}).then(res=>{
                    this.updateUserList()
                })
            },
            editUser(user){
                console.log(user)
                this.$router.push({
                    path:'/userAdd',
                    query:{
                        userId:user._id
                    }
                })
            },
            onClickLeft() {
                this.$router.go(-1);
            },
            onClickRight() {
                this.$router.push('/userAdd');
            },
            onLoad() {
                // 异步更新数据

            },
        }
    }
</script>

<style scoped lang="less">
    .user-list{
        .user-item{
            display: flex;
            align-items: center;
            width: 100%;
            img{
                width: 2rem;
                height: 2rem;
                border-radius: 50%;
                margin-right: .3rem;
            }
        }
    }
</style>