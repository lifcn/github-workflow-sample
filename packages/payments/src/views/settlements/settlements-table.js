const dateFormat = 'DD/MM/YYYY hh:mm A'

const TABLE_FILTERS = [
  {
    attribute: 'created',
    icon: 'el-icon-date',
    type: 'date',
  },
  {
    attribute: 'netAmount',
    label: 'NET',
    type: 'numeric',
    icon: 'el-icon-tickets',
  },
  {
    attribute: 'accountTransferred',
    label: 'Settlment Account',
    type: 'string',
    icon: 'el-icon-document',
  },
  {
    attribute: 'status',
    type: 'select',
    icon: 'el-icon-document',
    values: [
      {
        label: 'Finalised',
        value: 'Finalised',
      },
      {
        label: 'Pending',
        value: 'Pending',
      },
      {
        label: 'Refunded',
        value: 'Refunded',
      },
      {
        label: 'Failed',
        value: 'Failed',
      },
    ],
  },
  {
    attribute: 'dateFinalised',
    type: 'date',
    icon: 'el-icon-document',
  },
]

const TABLE_COLUMNS = [
  {
    name: 'created',
    label: 'Date created',
    icon: 'el-icon-document',
    width: 100,
    format: {
      name: 'date',
      params: ['DD/MM/YYYY'],
    },
  },
  {
    name: 'netAmount',
    label: 'NET',
    icon: 'el-icon-document',
    format: 'dollar',
    component: {
      props: {
        styleObj(val) {
          if (val < 0) {
            return { color: '#fc7168' }
          }

          return {}
        },
      },
    },
  },
  {
    name: 'accountTransferred',
    label: 'Settlment Account',
    width: 100,
    format: 'account',
  },
  {
    name: 'status',
    label: 'Status',
    icon: 'el-icon-document',
    width: 100,
    component: {
      props: {
        styleObj(val) {
          switch (val) {
            case 'Pending': return { color: '#fbb241' }
            case 'Finalised': return { color: '#29d737' }
            case 'Failed': return { color: '#fc7168' }
            case 'Refunded': return { color: '#fc7168' }
            default: return {}
          }
        },
        badge(val) {
          switch (val) {
            case 'Pending': return {
              name: 'el-icon-time',
              pos: 'left',
            }
            case 'Finalised': return {
              name: 'el-icon-check',
              pos: 'left',
            }
            case 'Failed': return {
              name: 'el-icon-close',
              pos: 'left',
            }
            case 'Refunded': return {
              name: 'el-icon-refresh',
              pos: 'left',
            }
            default: return {}
          }
        },
      },
    },
  },
  {
    name: 'dateFinalised',
    label: 'Date Finalised',
    icon: 'el-icon-document',
    width: 100,
    format: {
      name: 'date',
      params: [dateFormat],
    },
  },

]

export default {
  filters: TABLE_FILTERS,
  columns: TABLE_COLUMNS,
}