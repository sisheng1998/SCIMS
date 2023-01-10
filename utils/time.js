const getDateString = () => {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const hours = String(today.getHours()).padStart(2, '0')
  const minutes = String(today.getMinutes()).padStart(2, '0')
  const seconds = String(today.getSeconds()).padStart(2, '0')

  const date = `${year}${month}${day}-${hours}${minutes}${seconds}`
  return date
}

const duration = {
  milliseconds: (value) => value,
  seconds: (value) => value * duration.milliseconds(1000),
  minutes: (value) => value * duration.seconds(60),
  hours: (value) => value * duration.minutes(60),
  days: (value) => value * duration.hours(24),
}

module.exports = { getDateString, duration }
