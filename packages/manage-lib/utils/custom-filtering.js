function couponValidityPeriod(filter, custom) {
  const { comparison } = filter
  let source

  const valueExists = `doc.validityPeriod.size() != 0`
  const value = `doc.validityPeriod.value`

  if(comparison === 'eq') {
    source = `${valueExists} && ${value} == 'P${filter.value}M'`
  } else {
    let sign
    switch(comparison) {
      case 'lt': sign = '<'
        break
      case 'gt': sign = '>'
    }
    source = `${valueExists} && Integer.parseInt(${value}.substring(1,2)) ${sign} ${filter.value}`
  }

  return {
    script : {
      script : {
        source,
        lang: "painless",
        params:
          { ...filter, ...custom }
      }
    }
  }
}

function couponAmount(filter, custom) {
  const type = filter.value && filter.value[0]
  const percentage = 'doc.discountPercentage.size()'
  const source = (type === 'discountPercentage') ? `${percentage} != 0` : `${percentage} == 0`

  return {
    script : {
      script : {
        source,
        lang: "painless",
        params:
          { ...filter, ...custom }
      }
    }
  }
}

export {
  couponValidityPeriod,
  couponAmount,
}
