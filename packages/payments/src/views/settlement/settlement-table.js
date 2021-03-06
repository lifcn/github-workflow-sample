const dateFormat = 'DD/MM/YYYY hh:mm A'

const TABLE_COLUMNS = [
  {
    name: 'dateCreated',
    label: 'Date Created',
    format: {
      name: 'date',
      params: [dateFormat],
    },
  },
  {
    name: 'type',
    label: 'Type',
    component: {
      props: {
        styleObj(val) {
          if (val === 'Refund') {
            return { color: '#fc7168' }
          }

          return {}
        },
      },
    },
  },
  {
    name: 'amount',
    label: 'Amount',
    format: 'dollar',
  },
  {
    name: 'fee',
    label: 'Fee',
    format: 'dollar',
  },
  {
    name: 'net',
    label: 'NET',
    format: 'dollar',
  },
  {
    name: 'statementDescriptor',
    label: 'Statement Descriptor',
  },
  {
    name: 'orderId',
    label: 'Order ID',
  },
  {
    name: 'status',
    label: 'Status',
    component: {
      props: {
        styleObj(val) {
          switch (val) {
            case 'pending': return { color: '#fbb241' }
            case 'successful': return { color: '#29d737' }
            case 'failed': return { color: '#fc7168' }
            case 'refunded': return { color: '#fc7168' }
            default: return {}
          }
        },
        badge(val) {
          switch (val) {
            case 'pending': return {
              name: 'el-icon-time',
              pos: 'left',
            }
            case 'successful': return {
              name: 'el-icon-check',
              pos: 'left',
            }
            case 'failed': return {
              name: 'el-icon-close',
              pos: 'left',
            }
            case 'refunded': return {
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
    format: {
      name: 'date',
      params: [dateFormat],
    },
  },
  {
    name: 'paymentMethod',
    label: 'Payment Method',
  },
]

export default {
  columns: TABLE_COLUMNS,
}
