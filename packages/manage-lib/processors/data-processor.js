import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import merge from 'deepmerge'
import flattenDeep from 'lodash/flattenDeep'

const createEmptyQuery = () => {
  return {
    bool: { filter: [] },
    filters: [],
    sort: {},
    page: 1,
    pageSize: 15,
    hide: [],
  }
}

/*
 * All items in arrays should have "attribute" element
 */
function mergeQueries(a, b) {
  return merge(a, b, {
    /*
     * First array have higher priority
     * >>> Need to do this better
     */
    arrayMerge: (highArray, lowArray, options) => {
      const result = cloneDeep(highArray)

      cloneDeep(lowArray).forEach(lowItem => {
        /*
         * Works only for filters now
         */
        const alreadyAdded = highArray.find(highItem => {
          return highItem.attribute === lowItem.attribute && highItem.value === lowItem.value
        })


        if (!alreadyAdded || alreadyAdded.script) {
          result.push(lowItem)
        }
      })

      return result
    },
  })
}

export default class DataProcessor {
  constructor(params = {}) {
    this.data = []
    this.total = 0
    this.loadingQueueLength = 1
    this.isFirstRequest = true
    this.staticQuery = params.staticQuery || {}
    this.defaultQuery = params.query
    this.dataQuery = null
    this.disableQueryString = Boolean(params.disableQueryString)
    this.component = params.component
    this.skipNextURLWatcher = false
  }

  init() {
    if (!this.disableQueryString) {
      this.setupURLWatcher()
    }

    this.applyFiltersFromURL()

    return this.getData({ shouldUpdateURL: false })
  }

  setupURLWatcher() {
    const { component } = this

    if (!component) {
      throw new Error(
        '"component" key must be provided in data-processor options. ' +
          'Or you can set "disableQueryString" to true.'
      )
    }

    component.$watch('$route.query.q', () => {
      if (!this.skipNextURLWatcher) {
        this.applyFiltersFromURL()
        this.getData({ shouldUpdateURL: false })
      }

      this.skipNextURLWatcher = false
    })
  }

  get filters() {
    return get(this.dataQuery, 'filters', [])
  }

  get boolFilters() {
    return get(this.dataQuery, 'bool.filter', [])
  }

  get pageCount() {
    return Math.ceil(this.total / this.dataQuery.pageSize)
  }

  get loading() {
    return this.loadingQueueLength > 0
  }

  readQueryString() {
    const queryString = this.component.$router.currentRoute.query.q

    try {
      const decodedString = atob(queryString)
      return JSON.parse(decodedString)
    } catch (err) {
      return null
    }
  }

  applyFiltersFromURL() {
    let queryString = ''

    if (!this.disableQueryString) {
      queryString = this.readQueryString()
    }

    const initQuery = queryString || this.defaultQuery || {}

    this.dataQuery = mergeQueries(createEmptyQuery(), initQuery)
  }

  updateURL() {
    if (this.disableQueryString) return

    const queryString = JSON.stringify(this.dataQuery)

    this.skipNextURLWatcher = true

    this.component.$router.push({ query: { q: btoa(queryString) } })
  }

  async getData({ shouldUpdateURL } = {}) {
    const { dataQuery, disableQueryString } = this
    const query = mergeQueries(this.staticQuery, dataQuery)

    if (this.isFirstRequest) {
      this.isFirstRequest = false
    }
    else {
      this.loadingQueueLength++
    }

    if (!disableQueryString && shouldUpdateURL) {
      this.updateURL()
    }

    try {
      const { data, total } = await this.sendRequest(query)

      this.data = data
      this.total = total
    } catch (error) {
      console.error('Error while requesting data', error)
    } finally {
      this.loadingQueueLength--
    }

    return this.data
  }

  async getAllData() {
    const query = mergeQueries(this.staticQuery, this.dataQuery)

    try {
      return await this.sendRequestAll(query)
    } catch (error) {
      console.error('Error while requesting elastic data', error)
    }
  }

  async sendRequest() {
    console.error('DataProcessor:sendRequest - method should be implemented')

    return {
      data: [],
      total: 0,
    }
  }

  async sendRequestAll() {
    console.error('DataProcessor:sendRequestAll - method should be implemented')

    return {
      data: [],
      total: 0,
    }
  }

  applyFilter(filter, index, custom = false) {
    if(custom) {
      this.boolFilters.splice(index, 1, custom(filter))
    } else {
      if(Array.isArray(filter.value)){
        filter.value = flattenDeep(filter.value)
      }
      this.filters.splice(index, 1, filter)
    }
    this.dataQuery.page = 1

    return this.getData({ shouldUpdateURL: true })
  }

  removeFilter(index, filter) {
    if(filter.customFiltering) {
      const i = this.boolFilters.findIndex(f => get(f, 'script.script.params.attribute') === filter.attribute)
      this.boolFilters.splice(i, 1)
    }
    this.filters.splice(index, 1)

    return this.getData({ shouldUpdateURL: true })
  }

  updatePage(page) {
    const { dataQuery } = this

    dataQuery.page = page

    return this.getData({ shouldUpdateURL: true })
  }

  updatePageSize(pageSize) {
    const { dataQuery } = this

    dataQuery.pageSize = pageSize
    dataQuery.page = 1

    return this.getData({ shouldUpdateURL: true })
  }

  updateSort(attribute, order, customSorting = false) {

    const { dataQuery } = this

    if (order) {
      if(customSorting) {
        dataQuery.sort['_script'] = customSorting(order, attribute)
      } else {
        dataQuery.sort[attribute] = order
      }
    } else {
      customSorting ? delete dataQuery.sort['_script'] : delete  dataQuery.sort[attribute]
      if(customSorting) {
        delete dataQuery.sort['_script']
      } else {
        delete  dataQuery.sort[attribute]
      }
    }

    return this.getData({ shouldUpdateURL: true })
  }

  updateHide(newHideList) {
    const { dataQuery, disableQueryString } = this

    dataQuery.hide = newHideList

    if (!disableQueryString) {
      this.updateURL()
    }
  }
}
