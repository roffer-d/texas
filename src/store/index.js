import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

import common from './modules/global'

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    common
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
