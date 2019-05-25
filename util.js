const getYearMonthDay = date => {
  let year = date.getFullYear()
  let month = date.getMonth()
  let day = date.getDate()
  return {
    year,
    month,
    day
  }
}

const getDate = (year, month, day = 1) => {
  return new Date(year, month, day)
}

export {
  getYearMonthDay,
  getDate
}