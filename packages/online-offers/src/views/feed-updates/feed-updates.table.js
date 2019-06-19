const TABLE_FILTERS = [
  {
    attribute: 'update',
    type: 'select',
    icon: 'el-icon-document',
    values: [
      {
        label: 'New offer',
        value: 'New offer',
      },
      {
        label: 'New merchant',
        value: 'New merchant',
      },
      {
        label: 'Deleted merchant',
        value: 'Deleted merchant',
      },
      {
        label: 'Offer update',
        value: 'Offer update',
      },
      {
        label: 'Merchant update',
        value: 'Merchant update',
      },
    ],
  },
  {
    attribute: 'merchant.name',
    type: 'string',
    icon: 'el-icon-document',
  },
  {
    attribute: 'feed',
    type: 'string',
    icon: 'el-icon-document',
  },
  {
    attribute: 'created_at',
    label: 'Date created',
    type: 'date',
    icon: 'el-icon-date',
  },
]

const TABLE_COLUMNS = [
  {
    name: 'update',
    icon: 'el-icon-document',
    component: {
      props: {
        styleObj(val) {
          switch (val) {
            case 'New offer': return { color: '#2885b7' }
            case 'New merchant': return { color: '#40d2bc' }
            case 'Deleted merchant': return { color: '#fc1c1e' }
            case 'Offer update': return { color: '#9ac200' }
            case 'Merchant update': return { color: '#b807ca' }
            default: return {}
          }
        },
        badge: {
          name: 'el-icon-info',
          pos: 'left',
        },
      },
    },
  },
  {
    name: 'merchant.name',
    icon: 'el-icon-document',
  },
  {
    name: 'created_at',
    label: 'Date created',
    icon: 'el-icon-date',
    format: 'date',
  },
  {
    name: 'feed',
    icon: 'el-icon-document',
  },
]

export default {
  filters: TABLE_FILTERS,
  columns: TABLE_COLUMNS,
  processor: null,
}
