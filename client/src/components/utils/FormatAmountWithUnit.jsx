const FormatAmountWithUnit = (amount, unit) =>
  parseFloat(Number(amount).toFixed(2)) + ' ' + unit

export default FormatAmountWithUnit
