import Vue from 'vue'
import Vuex from 'vuex'

import ui from './ui'
import product from './product.js'
import provider from './provider.js'
import version from './version.js'
import user from './user.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    ui,
    product,
    provider,
    version,
    user
  },
})
