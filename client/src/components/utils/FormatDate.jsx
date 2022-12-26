import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
    m: '1 minute',
    mm: '%d minutes',
    h: '1 hour',
    hh: '%d hours',
    d: '1 day',
    dd: '%d days',
    M: '1 month',
    MM: '%d months',
    y: '1 year',
    yy: '%d years',
  },
})

const FormatDate = (value) => {
  const options = {
    day: 'numeric',
    year: 'numeric',
    month: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h12',
  }

  const formattedDate = new Date(value)

  return formattedDate.toLocaleString('en-GB', options).toUpperCase()
}

export default FormatDate

const FormatChemicalDate = (value) =>
  new Date(value).toLocaleDateString('en-GB')

const FromNow = (value) => dayjs(value).fromNow()

const DateTime = (value) =>
  dayjs(value).format('dddd, MMMM D, YYYY [at] h:mm A')

const NotificationDate = (value) => dayjs(value).format('DD/MM/YYYY')

const NotificationTime = (value) => dayjs(value).format('h:mm A')

export {
  FormatChemicalDate,
  FromNow,
  DateTime,
  NotificationDate,
  NotificationTime,
}
