const getInitials = (name) => {
  let initials
  const nameSplit = name.split(' ')
  const nameLength = nameSplit.length

  if (nameLength > 1) {
    initials =
      nameSplit[0].substring(0, 1) + nameSplit[nameLength - 1].substring(0, 1)
  } else if (nameLength === 1) {
    initials = nameSplit[0].substring(0, 1)
  } else return

  return initials.toUpperCase()
}

const GetLetterPicture = (name) => {
  if (name == null) return

  const initials = getInitials(name)
  const size = 500

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.width = canvas.height = size

  context.fillStyle = '#F9FAFB'
  context.fillRect(0, 0, size, size)

  context.fillStyle = '#374151'
  context.textBaseline = 'middle'
  context.textAlign = 'center'
  context.font = `${size / 2.5}px sans-serif`
  context.fillText(initials, size / 2, size / 1.85)

  return canvas.toDataURL()
}

export default GetLetterPicture
