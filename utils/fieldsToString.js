const fieldsToString = (fieldsObj) => {
  const recursive = (obj, currentPath = '') =>
    Object.entries(obj).reduce((accumulator, [key, value]) => {
      const newPath = currentPath ? `${currentPath}.${key}` : key
      if (typeof value === 'object' && value !== null) {
        accumulator.push(...recursive(value, newPath))
      } else {
        accumulator.push(newPath)
      }
      return accumulator
    }, [])

  return recursive(fieldsObj).join(' ')
}

module.exports = fieldsToString
