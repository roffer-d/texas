import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import config from './global/'

Vue.use(config)

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
