import ElasticProcessor from '@lib/processors/elastic-processor'

const TABLE_FILTERS = [
  {
    attribute: 'createdAt',
    label: 'Date Created',
    icon: 'el-icon-date',
    type: 'date',
  },
  {
    attribute: 'type',
    label: 'Type',
    type: 'select',
    icon: 'el-icon-price-tag',
    values: [
      {
        label: 'Recurrring',
        value: 'recurring',
      },
      {
        label: 'One Off',
        value: 'one_off',
      },
    ]
  },
  {
    attribute: 'amount.total',
    label: 'Amount',
    type: 'numeric',
    icon: 'el-icon-money',
  },
  {
    attribute: 'customerId',
    label: 'Customer ID',
    type: 'string',
    icon: 'el-icon-s-custom',
  },
  {
    attribute: 'customerFirstName',
    label: 'First Name',
    type: 'string',
    icon: 'el-icon-user',
  },
  {
    attribute: 'customerLastName',
    label: 'Last Name',
    type: 'string',
    icon: 'el-icon-user',
  },
  {
    attribute: 'orderDescription',
    label: 'Description',
    type: 'string',
    icon: 'el-icon-data-board',
  },
  {
    attribute: 'crn',
    label: 'CRN',
    type: 'string',
    icon: 'el-icon-house',
  },
  {
    attribute: 'orderId',
    label: 'Order ID',
    type: 'string',
    icon: 'el-icon-document',
  },
  {
    attribute: 'status',
    type: 'select',
    icon: 'el-icon-circle-check',
    values: [
      {
        label: 'Completed',
        value: 'completed',
      },
      {
        label: 'Finalised',
        value: 'finalised',
      },
      {
        label: 'Processing',
        value: 'pending',
      },
      {
        label: 'Failed',
        value: 'failed',
      },
    ],
  },
]

const TABLE_COLUMNS = [
  {
    name: 'createdAt',
    label: 'Date Created',
    icon: 'el-icon-date',
    format: 'dateTime',
  },
  {
    name: 'type',
    label: 'Type',
    icon: 'el-icon-price-tag',
    format: 'capital',
    width: 120,
    component: {
      props: {
        styleObj(val) {
          if (val === 'refund') {
            return { color: '#fc7168' }
          }

          return {}
        },
      },
    },
  },
  {
    name: 'amount.total',
    label: 'Amount',
    icon: 'el-icon-money',
    format: 'dollar',
    width: 120,
    component: {
      props: {
        styleObj(val, row) {
          if (val < 0 || row.type === 'refund') {
            return { color: '#fc7168' }
          }

          return {}
        },
        format(value, row) {
          return row.type === 'refund' ? `(${value})` : value
        },
      },
    },
  },
  {
    name: 'customerId',
    label: 'Customer ID',
    icon: 'el-icon-s-custom',
    width: 120,
  },
  {
    name: 'customerFirstName',
    label: 'First Name',
    icon: 'el-icon-user',
    width: 120,
    component: {
      props: {
        allowEmpty: true,
      },
    },
  },
  {
    name: 'customerLastName',
    label: 'Last Name',
    icon: 'el-icon-user',
    width: 120,
    component: {
      props: {
        allowEmpty: true,
      },
    },
  },
  {
    name: 'orderDescription',
    label: 'Description',
    icon: 'el-icon-data-board',
    width: 200,
  },
  {
    name: 'crn',
    label: 'CRN',
    icon: 'el-icon-house',
    width: 120,
  },
  {
    name: 'orderId',
    label: 'Order ID',
    icon: 'el-icon-document',
    width: 120,
  },
  {
    name: 'status',
    label: 'Status',
    icon: 'el-icon-circle-check',
    format: 'capital',
    width: 120,
    component: {
      props: {
        styleObj(_, row) {
          switch (row.status) {
            case 'pending': return { color: '#fbb241' }
            case 'completed': return { color: '#29d737' }
            case 'failed': return { color: '#fc7168' }
            case 'finalised': return { color: '#29d737' }
            default: return {}
          }
        },
        badge(_, row) {
          switch (row.status) {
            case 'pending': return {
              name: 'el-icon-time',
              pos: 'left',
            }
            case 'completed': return {
              name: 'el-icon-check',
              pos: 'left',
            }
            case 'finalised': return {
              name: 'el-icon-check',
              pos: 'left',
            }
            case 'failed': return {
              name: 'el-icon-close',
              pos: 'left',
            }
            default: return {}
          }
        },
        value(_, row) {
          return row.status === 'pending' ? 'Processing' : row.status
        }
      },
    },
  },
]

export default function(component) {
  return {
    processor: new ElasticProcessor({
      index: 'transactions',
      component,
      staticQuery: {
        filters: [
          {
            attribute: 'subscriptionId',
            value: component.id,
          },
        ],
      },
      query: {
        sort: { createdAt: { order: 'desc' } }
      }
    }),
    filters: TABLE_FILTERS,
    columns: TABLE_COLUMNS,
  }
}
