import dayjs from 'dayjs'

function nextDay() {
  return dayjs().add(1, 'day').startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]')
}

function dateIsAfter(dateOne, dateTwo) {
  // Check that dateOne is after dateTwo
  return dayjs(dateOne).isAfter(dayjs(dateTwo))
}

function activeByDate(startAt, endAt) {
  if(endAt) {
    return dayjs().isAfter(dayjs(startAt)) && dayjs().isBefore(dayjs(endAt))
  } else {
    return dayjs().isAfter(dayjs(startAt))
  }
}

function sameDate(dateOne, dateTwo) {
  return dayjs(dateOne).startOf('day').isSame(dayjs(dateTwo).startOf('day'))
}

const datePickerFormat = `yyyy-MM-dd'T'HH:mm:ss'Z'`

export {
  nextDay,
  datePickerFormat,
  dateIsAfter,
  activeByDate,
  sameDate
}
