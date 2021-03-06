import get from 'lodash/get'
import { Notification } from 'element-ui'
import Widget from '~/widgets/widget'
import api from '@lib/api'

const state = {
  /*
   * Available widgets
   */
  registered: {},
  widgets: [],
  config: [],
  publishing: false,
}

const getters = {
  widgets: s => s.widgets,
  config: s => s.config,
  registered: s => s.registered,
  publishing: s => s.publishing,
  getConfig: (s, g) => () => {
    return g.widgets.map(widget => {
      return widget.build()
    })
  }
}

const mutations = {
  REGISTER_WIDGETS(state, widgets) {
    const registered = {}

    widgets.forEach(widget => {
      registered[widget.name] = widget
    })

    state.registered = registered
  },
  ADD_WIDGET(state, { index, config, select }) {
    const widget = new Widget({
      config,
      // unique key for render optimization
      key: `${state.widgets.length}_${Date.now()}`,
      meta: state.registered[config.name],
    })

    if (index) {
      state.widgets.splice(index, 0, widget)
    } else {
      state.widgets.push(widget)
    }

    if (select) {
      state.selectedWidget = widget
    }
  },
  DELETE_WIDGET(state, widget) {
    const { widgets } = state
    const index = widgets.indexOf(widget)

    widgets.splice(index, 1)
  },
  MOVE_WIDGET_UP(state, widget) {
    const { widgets } = state
    const index = widgets.indexOf(widget)

    if (index > 0) {
      const prevWidget = widgets[index - 1]
      widgets.splice(index - 1, 2, widget, prevWidget)
    }
  },
  MOVE_WIDGET_DOWN(state, widget) {
    const { widgets } = state
    const index = widgets.indexOf(widget)

    if (index + 1 < widgets.length) {
      const nextWidget = widgets[index + 1]
      widgets.splice(index, 2, nextWidget, widget)
    }
  },
  SET_PUBLISHING(state, value) {
    state.publishing = value
  },
  RESET(state) {
    state.widgets = []
  },
}

const actions = {
  INIT({ commit }, dashboard) {
    if (dashboard instanceof Array) {
      commit('RESET')

      dashboard.forEach(record => {
        commit('ADD_WIDGET', {
          config: record,
        })
      })
    }
  },
  SEND_CONFIG({ dispatch, getters }) {
    const config = getters.getConfig()

    dispatch('exchange/SEND_TO_FRAME', {
      type: 'debi-dashboard',
      payload: config,
    }, { root: true })

    if (process.env.NODE_ENV !== 'production') {
      console.warn('Send configuration', config)
    }
  },
  async PUBLISH({ getters, rootGetters, commit }) {
    const baseUrl = process.env.VUE_APP_API_URL
    const config = getters.getConfig()
    const env = rootGetters['exchange/env']
    const provider = rootGetters['exchange/provider']
    const url = `${baseUrl}/dev/pages/dashboard`

    commit('SET_PUBLISHING', true)

    let [error, data] = await api.post(url, {
      content: config,
      provider,
      env,
    })

    if (get(data, 'success') === false) {
      error = data
    }

    if (error) {
      Notification.error({
        title: 'Dashboard is not published',
        message: get(error, 'message', 'Error while publishing the dashboard'),
      })
    } else {
      Notification.success({
        title: 'Dashboard published',
      })
    }

    commit('SET_PUBLISHING', false)
  },
  RESET({ dispatch, rootGetters }) {
    const config = rootGetters['exchange/config'] || {}
    dispatch('INIT', config.dashboard)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
