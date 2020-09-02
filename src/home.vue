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
                    <div v-for="item in pokerList" class="item" :key="item.value">
                        <div class="top">{{item.label}}</div>
                        <div class="bottom">{{item.label}}</div>
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
            <div class="ready" v-else-if="!user.ready && !isStart" @click="doReady">准备</div>
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
                basePokerList:[
                    {label:'A',value:1,color:1},{label:'A',value:1,color:2},{label:'A',value:1,color:3},{label:'A',value:1,color:4},
                    {label:'K',value:1,color:1},{label:'K',value:1,color:2},{label:'K',value:1,color:3},{label:'K',value:1,color:4},
                    {label:'Q',value:1,color:1},{label:'Q',value:1,color:2},{label:'Q',value:1,color:3},{label:'Q',value:1,color:4},
                    {label:'J',value:1,color:1},{label:'J',value:1,color:2},{label:'J',value:1,color:3},{label:'J',value:1,color:4},
                    {label:'10',value:1,color:1},{label:'10',value:1,color:2},{label:'10',value:1,color:3},{label:'10',value:1,color:4},
                    {label:'9',value:1,color:1},{label:'9',value:1,color:2},{label:'9',value:1,color:3},{label:'9',value:1,color:4},
                    {label:'8',value:1,color:1},{label:'8',value:1,color:2},{label:'8',value:1,color:3},{label:'8',value:1,color:4},
                    {label:'7',value:1,color:1},{label:'7',value:1,color:2},{label:'7',value:1,color:3},{label:'7',value:1,color:4},
                    {label:'6',value:1,color:1},{label:'6',value:1,color:2},{label:'6',value:1,color:3},{label:'6',value:1,color:4},
                    {label:'5',value:1,color:1},{label:'5',value:1,color:2},{label:'5',value:1,color:3},{label:'5',value:1,color:4},
                    {label:'4',value:1,color:1},{label:'4',value:1,color:2},{label:'4',value:1,color:3},{label:'4',value:1,color:4},
                    {label:'3',value:1,color:1},{label:'3',value:1,color:2},{label:'3',value:1,color:3},{label:'3',value:1,color:4},
                    {label:'2',value:1,color:1},{label:'2',value:1,color:2},{label:'2',value:1,color:3},{label:'2',value:1,color:4}
                ],
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
            async getData() {
                // this.user = await this.http.post('/api/userInfo')
                this.user = JSON.parse(localStorage.getItem('user'))
                this.$set(this.user,'ready',false)

                // let res = await this.updateUserList()
                // this.onlineUsers = JSON.parse(JSON.stringify(res.data))
            },
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
            ready(data){
                let user = this.onlineUsers.find(u=>{return u._id === data.userId})
                console.log(`玩家【${user.username}】已准备`)

                this.$set(user,'ready',true)

                let readyCount = this.onlineUsers.filter(u=>u.ready).length
                if(readyCount === this.onlineUsers.length){
                    console.log(`所有玩家都已准备就绪，开始游戏~`);

                    this.start()
                }
            },
            //举手准备
            doReady(){
                this.user.ready = true
                this.websocket.send({type:'ready',userId:this.user._id})
            },
            //开始对局
            start(){
                this.isStart = true;

                this.genPokers(2)
            },
            //生成底牌
            genPokers(len){
                let count = this.basePokerList.length
                for(let i = 0 ; i < len ; i ++){
                    let random = Math.floor(Math.random() * count)
                    console.log(random)
                }
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
            border: .05rem solid rgba(255,255,255,.8);
            border-radius: 1rem;
        }

        .current{
            /*position: absolute;*/
            /*bottom: 1rem;*/
            /*width: 100%;*/
            text-align: center;
            height: 7.5rem;

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