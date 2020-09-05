<template>
    <div class="main">
        <div class="other top">
            <div v-for="(item,index) in onlineUsers" :key="item._id"
                 v-if="item._id !== user._id && (index < 2 || index == 0)">
                <img class="head" :src="item.head"/>
                <div class="handle" v-if="item.ready && !isStart"><i class="iconfont icon-jushou"></i></div>
                <div class="dinner" v-if="item.isDinner && isStart">D</div>
                <div class="timer" v-if="item.isTimer && isStart">{{timer}}</div>
            </div>
        </div>
        <div class="bottom">
            <div class="other left">
                <div v-for="(item,index) in onlineUsers" :key="item._id"
                     v-if="item._id !== user._id && index >= 2 && index < 5">
                    <img class="head" :src="item.head"/>
                    <div class="handle" v-if="item.ready && !isStart"><i class="iconfont icon-jushou"></i></div>
                    <div class="dinner" v-if="item.isDinner && isStart">D</div>
                    <div class="timer" v-if="item.isTimer && isStart">{{timer}}</div>
                </div>
            </div>
            <div class="table">
                <div class="pokers">
                    <div v-for="(item,index) in pokerList" class="item"
                         :class="{red:[2,4].includes(item.color),black:[1,3].includes(item.color)}" :key="index">
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
                    <div class="timer" v-if="item.isTimer && isStart">{{timer}}</div>
                    <div class="dinner" v-if="item.isDinner && isStart">D</div>
                    <div class="handle" v-if="item.ready && !isStart"><i class="iconfont icon-jushou"></i></div>
                    <img class="head" :src="item.head"/>
                </div>
            </div>
        </div>
        <div class="current" v-for="item in onlineUsers" :key="item._id" v-if="item._id == user._id">
            <div class="timer" v-if="item.isTimer && isStart">{{timer}}</div>
            <div class="dinner" v-if="item.isDinner && isStart">D</div>
            <div class="handle" v-if="item.ready && !isStart"><i class="iconfont icon-jushou"></i></div>
            <div class="ready" @click="doReady" v-if="!item.ready && !isStart">准备</div>
            <!--            <div v-if="item.ready && isStart" class="null"></div>-->
            <img class="head" :src="item.head"/>
        </div>
    </div>
</template>

<script>
    import socket from "./global/socket";
    import constant from "../public/server/utils/constant";
    import {mapGetters, mapActions} from 'vuex'

    export default {
        name: "index",
        data() {
            return {
                user: {},
                onlineUsers: [],
                websocket: null,
                isStart: false,
                pokerList: [],
                dinerForUserIndex: -1,
                timer: 30
            }
        },
        computed: {
            ...mapGetters({
                userList: 'common/userList'
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
                this.websocket.addCallback('reconnect', this.reconnect)
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            ...mapActions({
                updateUserList: 'common/updateUserList'
            }),
            //获取当前登录用户信息
            async getData() {
                // this.user = await this.http.post('/api/userInfo')
                this.user = JSON.parse(localStorage.getItem('user'))
                this.$set(this.user, 'ready', false)

                /** 模拟数据 测试样式 **/
                // let res = await this.updateUserList()
                // this.onlineUsers = JSON.parse(JSON.stringify(res.data))
                // this.isStart=true
                // this.dinerForUserIndex = 3
                // let user = this.onlineUsers[this.dinerForUserIndex]
                // user.isDinner = true
                // this.$set(this.onlineUsers,this.dinerForUserIndex,user)
                // /** 设置读秒玩家位置（从dinner的下家开始） **/
                // let timerIndex = this.dinerForUserIndex + 1 > this.onlineUsers.length ? 0 : this.dinerForUserIndex + 1
                // let timeUser = this.onlineUsers[timerIndex]
                // user.isTimer = true
                // this.$set(this.onlineUsers, timerIndex, timeUser)
            },
            //玩家加入
            async join(data) {
                let list = this.userList

                if (!list.length) {
                    let res = await this.updateUserList()
                    list = res.data
                }

                let user = this.userList.find(u => {
                    return u._id === data.userId
                })
                console.log(`玩家【${user.username}】加入`)

                let onlineUserIds = data.onlineUsers.join(',')

                /** 模拟数据 测试样式时，屏蔽以下梁行代码 **/

                this.onlineUsers = list.filter(item => onlineUserIds.indexOf(item._id) !== -1)
                this.onlineUsers = JSON.parse(JSON.stringify(this.onlineUsers))
            },
            //玩家离线
            async out(data) {
                let list = this.userList

                if (!list.length) {
                    let res = await this.updateUserList()
                    list = res.data
                }

                let user = this.userList.find(u => {
                    return u._id === data.userId
                })
                console.log(`玩家【${user.username}】退出`)

                let onlineUserIds = data.onlineUsers.join(',')
                this.onlineUsers = list.filter(item => onlineUserIds.indexOf(item._id) !== -1)
                this.onlineUsers = JSON.parse(JSON.stringify(this.onlineUsers))
            },
            //点击准备
            ready(data) {
                let user = this.onlineUsers.find(u => {
                    return u._id === data.userId
                })
                console.log(`玩家【${user.username}】已准备`)

                this.$set(user, 'ready', true)

                //所有玩家准备就绪,开始对局
                if (data.gameInfo.isStart) {
                    this.dinerForUserIndex = data.gameInfo.dinerForUserIndex
                    this.start(data.gameInfo.pokerList)
                }
            },
            //离线重连接
            async reconnect(data) {
                await this.join(data)

                let user = this.onlineUsers.find(u => {
                    return u._id === data.userId
                })
                console.log(`玩家【${user.username}】回来了`)

                this.$set(user, 'ready', true)

                //获取当前对局数据
                if (data.pokerList.length) {
                    this.start(data.pokerList)
                }
            },
            //举手准备
            doReady() {
                this.user.ready = true
                this.websocket.send({type: 'ready', userId: this.user._id})
            },
            //开始对局
            start(pokerList) {
                /** 设置dinner玩家位置 **/
                let user = this.onlineUsers[this.dinerForUserIndex]
                user.isDinner = true
                this.$set(this.onlineUsers, this.dinerForUserIndex, user)

                /** 设置读秒玩家位置（从dinner的下家开始） **/
                let timerIndex = this.dinerForUserIndex + 1 > this.onlineUsers.length ? 0 : this.dinerForUserIndex + 1
                let timeUser = this.onlineUsers[timerIndex]
                user.isTimer = true
                this.$set(this.onlineUsers, timerIndex, timeUser)

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

        .dinner {
            background: #fff;
            border-radius: 50%;
            width: 1.5rem;
            height: 1.5rem;
            color: #555;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .timer{
            background: #fff;
            border-radius: 50%;
            width: 2rem;
            height: 2rem;
            color: #c32026;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .head {
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
        }

        .bottom {
            display: flex;
            justify-content: space-between;
            height: calc(100vh - 15rem);
        }

        .other {
            display: flex;

            .handle {
                transform: rotate(180deg);
            }

            &.top {
                justify-content: center;
                align-items: center;
                height: 7.5rem;

                > div {
                    margin: 1rem 3rem;
                    position: relative;

                    .dinner {
                        position: absolute;
                        top: calc(50% - 1rem);
                        left: calc(50% - 4rem);
                    }

                    .timer{
                        position: absolute;
                        top: calc(50% - 1rem);
                        left: calc(50% - 4rem);
                    }
                }
            }

            &.left {
                flex: 1;
                color: #fff;
                flex-flow: column;

                > div {
                    display: flex;
                    margin: 3rem 1rem;
                    position: relative;

                    .dinner {
                        position: absolute;
                        left: 17%;
                        top: -2rem;
                    }

                    .timer{
                        position: absolute;
                        bottom: -3rem;
                        left: calc(50% - 1.7rem);
                    }

                    .handle {
                        /*margin: 0 0 .5rem 0;*/
                        width: 2rem;
                        transform: rotate(90deg);
                    }
                }
            }

            &.right {
                flex: 1;
                color: #fff;
                text-align: right;
                flex-flow: column;

                > div {
                    display: flex;
                    margin: 3rem 1rem;
                    position: relative;

                    .dinner {
                        position: absolute;
                        left: 17%;
                        bottom: -2rem;
                    }

                    .timer{
                        position: absolute;
                        left: 11%;
                        top: -3rem;
                    }

                    .handle {
                        /*margin: 0 0 .5rem 0;*/
                        width: 2rem;
                        transform: rotate(-90deg);
                    }
                }
            }
        }

        .table {
            flex: 2;
            display: flex;
            align-items: center;
            justify-content: center;
            border: .05rem solid rgba(255, 255, 255, .2);
            border-radius: 1rem;

            .pokers {
                display: flex;
                width: 100%;
                text-align: center;
                justify-content: center;

                .item {
                    width: 2.2rem;
                    height: 3.6rem;
                    background: #fff;
                    margin: 0.1rem;
                    border-radius: 0.15rem;
                    box-shadow: 0.1rem 0.1rem 0.1rem 0.1rem #525252;
                    font-size: 0.8rem;
                    font-weight: 500;
                    position: relative;

                    &.red {
                        color: #ff1f1f;
                    }

                    &.black {
                        color: #000;
                    }

                    > div {
                        position: absolute;

                        &.item-top {
                            left: .1rem;
                        }

                        &.item-bottom {
                            right: .1rem;
                            bottom: .1rem;
                            transform: rotate(180deg);
                        }
                    }
                }
            }
        }

        .current {
            text-align: center;
            height: 7.5rem;
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: inherit;
            position: relative;

            .dinner {
                position: absolute;
                left: calc(50% - 4rem);
            }

            .timer {
                position: absolute;
                right: calc(50% - 4.5rem);
            }

            .null {
                height: 2rem;
            }

            .ready {
                color: #fff;
                width: 3rem;
                height: 2rem;
                line-height: 2rem;
                text-align: center;
                margin: 1rem auto;
                background: #7dbf3a;
                border-radius: .2rem;
            }
        }

        .handle {
            color: #f1ff4f;
            text-align: center;
            margin: 1rem auto;

            i {
                font-size: 1.5rem;
            }
        }
    }
</style>