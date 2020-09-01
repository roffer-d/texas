import axios from '../../global/axios-config'

const state = {
  userList:[]
}

/**
 * 从 store 中的 state 中派生出一些状态
 * https://vuex.vuejs.org/zh/guide/getters.html
 */
const getters = {
  userList: state => {
    return state.userList
  }
}

/**
 * Action 类似于 mutation，不同在于：
 * Action 提交的是 mutation，而不是直接变更状态。
 * Action 可以包含任意异步操作。
 * https://vuex.vuejs.org/zh/guide/actions.html
 */
const actions = {
  async updateUserList(context){
    let res = await axios.post('/api/userList')
    context.commit('updateUserList',res.data);
  }
}

/**
 * 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。
 * Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。
 * 这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数
 * https://vuex.vuejs.org/zh/guide/mutations.html
 */
const mutations = {
  updateUserList(state,data){
    state.userList = data
  }
}

export default {
  /**
   * 默认情况下，模块内部的 action、mutation 和 getter 是注册在全局命名空间的——这样使得多个模块能够对同一 mutation 或 action 作出响应。
   * 如果希望你的模块具有更高的封装度和复用性，你可以通过添加 namespaced: true 的方式使其成为带命名空间的模块。
   * 当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名
   * https://vuex.vuejs.org/zh/guide/modules.html
   */
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
