
const state = {}

const getters = {
  menu(s, g, rs, rg) {
    return [
      {
        title: 'Clients',
        path: '/clients',
        icon: 'user',
      },
      {
        title: 'Global Merchants',
        path: '/merchants',
        icon: 'goods',
      },
      {
        title: 'Feed Updates',
        path: '/feed-updates',
        icon: 'refresh-right',
        children: rg['feeds/feeds'].map(item => {
          return {
            title: item.name,
            path: `/feed-updates/${item.slug}`,
          }
        }),
      },
      {
        title: 'Feed Status',
        path: '/feed-status',
        icon: 's-marketing',
      },
    ]
  },
}

const mutations = {}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true,
}
