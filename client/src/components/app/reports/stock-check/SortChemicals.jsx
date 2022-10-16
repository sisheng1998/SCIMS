const partition = (array, filter) => {
  let pass = []
  let fail = []

  array.forEach((e, idx, arr) => (filter(e, idx, arr) ? pass : fail).push(e))

  return [pass, fail]
}

const sortByLocation = (array) =>
  array.sort((a, b) =>
    a.location.toLowerCase() > b.location.toLowerCase() ? 1 : -1
  )

const addIndex = (array) =>
  array.map((arrayItem, index) => ({
    ...arrayItem,
    index,
  }))

const SortChemicals = (chemicals) => {
  const [amountMatch, amountMismatch] = partition(
    chemicals,
    (e) => e.amount === e.amountInDB
  )

  const sortedAmountMatch = sortByLocation(amountMatch)
  const sortedAmountMismatch = sortByLocation(amountMismatch)

  const combinedArray = [...sortedAmountMismatch, ...sortedAmountMatch]
  const sortedChemicals = addIndex(combinedArray)

  return sortedChemicals
}

export default SortChemicals

const NormalSorting = (chemicals) => {
  const sortedWithLocation = sortByLocation(chemicals)
  const sortedChemicals = addIndex(sortedWithLocation)

  return sortedChemicals
}

export { NormalSorting }
