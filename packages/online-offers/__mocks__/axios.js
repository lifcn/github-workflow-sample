// Do not touch this file
import mockAxios from 'jest-mock-axios'

mockAxios.mockResponseFrom = function(path) {
  const data = require('../tests/__fixtures__/' + path)

  return mockAxios.mockResponse({ data })
}

export default mockAxios
