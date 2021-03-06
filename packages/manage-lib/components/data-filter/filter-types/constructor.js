import get from 'lodash/get'
import startCase from 'lodash/startCase'
import DefaultFilter from './default-filter'

export default class FilterType {
  constructor(params = {}) {
    this.label = params.label || startCase(params.attribute)
    this.attribute = params.attribute
    this.icon = params.icon
    this.type = params.type
    this.values = params.values
    this.booleanValues = params.booleanValues || {
      is_true: {
        label: 'true',
        value: true,
      },
      is_false: {
        label: 'false',
        value: false,
      },
    }
    if (params.customFiltering) {
      this.customFiltering = params.customFiltering
    }
  }

  get filterComponent() {
    return DefaultFilter
  }

  get metaConditions() {
    return {}
  }

  getSummary(filter) {
    const comparison = this.getComparison(filter.comparison)
    const prefix = comparison && comparison.prefix
    const isAmount = filter.attribute.includes('amount') || filter.attribute.includes('total') || filter.attribute.includes('price')

    if (filter.customLabel) {
      return `${this.label} ${prefix} ${filter.customLabel(filter.value)}`
    } else if (/null|undefined/.test(filter.value)) {
      return this.label
    } else {
      return `${this.label} ${prefix} ${isAmount ? `$${filter.value.toFixed(2)}` : filter.value}`
    }
  }

  getComparisons() {
    const comparisons = this.comparisons || {}
    return Object.keys(comparisons).map(key => {
      const comparison = comparisons[key]
      return {
        type: key,
        label: comparison[0],
        prefix: comparison[0],
      }
    })
  }

  getComparison(type) {
    const comparisons = this.getComparisons()
    return comparisons.find(i => i.type === type)
  }

  getFirstComparison() {
    const comparisons = this.getComparisons()
    return get(comparisons, '0')
  }
}
