<template>
    <div class="main">
        <div class="other top">
            <div v-for="(item,index) in onlineUsers" :key="item._id" v-if="item._id !== user._id && (index < 2 || index == 0)">
                <img class="head" :src="item.head" />
                <div class="handle"><i class="iconfont icon-jushou" v-if="item.ready && !isStart"></i></div>
            </div>
        </div>
        <div class="bottom">
            <div class="other left">
                <div v-for="(item,index) in onlineUsers" :key="item._id" v-if="item._id !== user._id && index >= 2 && index < 5">
                    <img class="head" :src="item.head" />
                    <div class="handle"><i class="iconfont icon-jushou" v-if="item.ready && !isStart"></i></div>
                </div>
            </div>
            <div class="table">
                <div class="pokers">
                    <div v-for="(item,index) in pokerList" class="item" :class="{red:[2,4].includes(item.color),black:[1,3].includes(item.color)}" :key="index">
                        <div class="item-top">
                            {{item.label}}
                        </div>
                        <div class="item-bottom">
                            {{item.label}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="other right">
                <div v-for="(item,index) in onlineUsers" :key="item._id" v-if="item._id !== user._id && index >= 5">
                    <div class="handle"><i class="iconfont icon-jushou" v-if="item.ready && !isStart"></i></div>
                    <img class="head" :src="item.head" />
                </div>
            </div>
        </div>
        <div class="current">
            <div class="handle" v-if="user.ready && !isStart"><i class="iconfont icon-jushou"></i></div>
            <div class="ready" @click="doReady" v-if="!user.ready && !isStart">准备</div>
            <div v-if="user.ready && isStart" class="null"></div>
            <img class="head" :src="user.head" />
        </div>
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
                user: {},
                onlineUsers:[],
                websocket:null,
                isStart:false,
                pokerList:[]
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

                this.websocket = new socket(`${constant.SOCKET_HOST}:${constant.SOCKET_PORT}/texas?_id=${user._id}&token=${token}`)
                this.websocket.addCallback('join', this.join)
                this.websocket.addCallback('out', this.out)
                this.websocket.addCallback('ready', this.ready)
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            ...mapActions({
                updateUserList:'common/updateUserList'
            }),
            //获取当前登录用户信息
            async getData() {
                // this.user = await this.http.post('/api/userInfo')
                this.user = JSON.parse(localStorage.getItem('user'))
                this.$set(this.user,'ready',false)

                // let res = await this.updateUserList()
                // this.onlineUsers = JSON.parse(JSON.stringify(res.data))
            },
            //玩家加入
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
                this.onlineUsers = JSON.parse(JSON.stringify(this.onlineUsers))
            },
            //玩家离线
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
                this.onlineUsers = JSON.parse(JSON.stringify(this.onlineUsers))
            },
            //点击准备
            ready(data){
                let user = this.onlineUsers.find(u=>{return u._id === data.userId})
                console.log(`玩家【${user.username}】已准备`)

                this.$set(user,'ready',true)

                //所有玩家准备就绪,开始对局
                if(data.pokerList.length){
                    this.start(data.pokerList)
                }
            },
            //举手准备
            doReady(){
                this.user.ready = true
                this.websocket.send({type:'ready',userId:this.user._id})
            },
            //开始对局
            start(pokerList){
                this.isStart = true;
                this.pokerList = pokerList
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
        position: relative;
        display: flex;
        flex-flow: column;
        justify-content: center;

        .head{
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
        }

        .bottom{
            display: flex;
            justify-content: space-between;
            height: calc(100vh - 15rem);
        }

        .other{
            display: flex;

            .handle{
                transform: rotate(180deg);
            }

            &.top{
                justify-content: center;
                align-items: center;
                height: 7.5rem;

                >div{
                    margin:1rem 3rem;
                }
            }
            &.left{
                flex: 1;
                color:#fff;
                flex-flow: column;

                >div{
                    display: flex;
                    margin:3rem 1rem;

                    .handle{
                        /*margin: 0 0 .5rem 0;*/
                        width: 2rem;
                        transform: rotate(90deg);
                    }
                }
            }
            &.right{
                flex: 1;
                color:#fff;
                text-align: right;
                flex-flow: column;

                >div{
                    display: flex;
                    margin:3rem 1rem;

                    .handle{
                        /*margin: 0 0 .5rem 0;*/
                        width: 2rem;
                        transform: rotate(-90deg);
                    }
                }
            }
        }
        .table{
            flex: 2;
            display: flex;
            align-items: center;
            justify-content: center;
            border: .05rem solid rgba(255,255,255,.2);
            border-radius: 1rem;

            .pokers{
                display: flex;
                width: 100%;
                text-align: center;
                justify-content: center;

                .item{
                    width: 2.2rem;
                    height: 3.6rem;
                    background: #fff;
                    margin: 0.1rem;
                    border-radius: 0.15rem;
                    box-shadow: 0.1rem 0.1rem 0.1rem 0.1rem #525252;
                    font-size: 0.8rem;
                    font-weight: 500;
                    position: relative;

                    &.red{
                        color: #ff1f1f;
                    }
                    &.black{
                        color: #000;
                    }

                    >div{
                        position: absolute;

                        &.item-top{
                            left:.1rem;
                        }
                        &.item-bottom{
                            right:.1rem;
                            bottom: .1rem;
                        }
                    }
                }
            }
        }

        .current{
            text-align: center;
            height: 7.5rem;
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: inherit;

            .null{
                height: 2rem;
            }

            .ready{
                color:#fff;
                width: 3rem;
                height: 2rem;
                line-height: 2rem;
                text-align: center;
                margin: 1rem auto;
                background: #7dbf3a;
                border-radius: .2rem;
            }
        }

        .handle{
            color:#f1ff4f;
            text-align: center;
            margin: 1rem auto;
            i{
                font-size: 1.5rem;
            }
        }
    }
</style>