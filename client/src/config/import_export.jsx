import STORAGE_CLASSES from '../config/storage_classes'

const COLUMNS = [
  {
    label: 'ID',
    value: '_id',
  },
  {
    label: 'CAS No.',
    value: 'CASId',
  },
  {
    label: 'Name',
    value: 'name',
  },
  {
    label: 'State',
    value: 'state',
  },
  {
    label: 'Unit',
    value: 'unit',
  },
  {
    label: 'Container Size',
    value: 'containerSize',
  },
  {
    label: 'Amount',
    value: 'amount',
  },
  {
    label: 'Minimum Amount (Notifications)',
    value: 'minAmount',
  },
  {
    label: 'Location',
    value: 'locationId',
  },
  {
    label: 'Storage Class',
    value: 'storageClass',
  },
  {
    label: 'Status',
    value: 'status',
  },
  {
    label: 'Date In',
    value: 'dateIn',
  },
  {
    label: 'Date Open',
    value: 'dateOpen',
  },
  {
    label: 'Expiration Date',
    value: 'expirationDate',
  },
  {
    label: 'Disposed Date',
    value: 'disposedDate',
  },
  {
    label: 'Supplier',
    value: 'supplier',
  },
  {
    label: 'Brand',
    value: 'brand',
  },
  {
    label: 'Notes',
    value: 'notes',
  },
]

const STATUS = [
  {
    label: 'Normal',
    value: 'Normal',
  },
  {
    label: 'Low Amount',
    value: 'Low Amount',
  },
  {
    label: 'Expiring Soon',
    value: 'Expiring Soon',
  },
  {
    label: 'Expired',
    value: 'Expired',
  },
  {
    label: 'Disposed',
    value: 'Disposed',
  },
]

const HEADERS = [
  {
    label: 'ID',
    key: '_id',
    sample: '62998746a5f5bc7cf5bc0c5d',
    description:
      'Leave it blank for new chemical. Otherwise the existing chemical with matched ID in current lab will be updated.',
  },
  {
    label: 'CAS No.*',
    key: 'CASNo',
    sample: '100-00-5',
    description:
      "Can't be changed once the chemical is added. Format: XXXXXXX-YY-Z",
  },
  {
    label: 'Name*',
    key: 'name',
    sample: '1-Chloro-4-Nitrobenzene',
    description:
      "Only alphabets, numbers, spaces, and symbols (-/,'.+) are allowed.",
  },
  {
    label: 'State*',
    key: 'state',
    sample: 'Liquid',
    description: 'Solid, Liquid, or Gas only.',
  },
  {
    label: 'Unit*',
    key: 'unit',
    sample: 'L',
    description: 'kg, g, mg, L, or mL only.',
  },
  {
    label: 'Container Size*',
    key: 'containerSize',
    sample: '1.5',
    description: 'Numbers with maximum 2 decimal places only.',
  },
  {
    label: 'Amount*',
    key: 'amount',
    sample: '0.75',
    description: 'Numbers with maximum 2 decimal places only.',
  },
  {
    label: 'Minimum Amount*',
    key: 'minAmount',
    sample: '0.1',
    description: 'Numbers with maximum 2 decimal places only.',
  },
  {
    label: 'Location',
    key: 'location',
    sample: 'Cabinet A',
    description:
      "Chemical's location in the current lab. The location will be auto created with 'Any Storage Classes' if the location not yet exist in the system.",
  },
  {
    label: 'Storage Class',
    key: 'storageClass',
    sample: '2A',
    description:
      '1, 2A, 2B, 3, 4.1A, 4.1B, 4.2, 4.3, 5.1A, 5.1B, 5.1C, 5.2, 6.1A, 6.1B, 6.1C, 6.1D, 6.2, 7, 8A, 8B, 10, 11, 12, 13, or 10-13 only.',
  },
  {
    label: 'Status',
    key: 'status',
    sample: 'Normal',
    description:
      'Leave it blank, the system will decide the status of the chemical.',
  },
  {
    label: 'Date In*',
    key: 'dateIn',
    sample: '30/11/2021',
    description: 'Format: DD/MM/YYYY',
  },
  {
    label: 'Date Open',
    key: 'dateOpen',
    sample: '02/01/2022',
    description: 'Format: DD/MM/YYYY',
  },
  {
    label: 'Expiration Date*',
    key: 'expirationDate',
    sample: '01/02/2024',
    description: 'Format: DD/MM/YYYY',
  },
  {
    label: 'Disposed Date',
    key: 'disposedDate',
    sample: '30/06/2022',
    description:
      'Leave it blank if the chemical is not disposed. Format: DD/MM/YYYY',
  },
  {
    label: 'Supplier',
    key: 'supplier',
    sample: 'Merck',
    description:
      "Only alphabets, numbers, spaces, and symbols (-/,'.+) are allowed.",
  },
  {
    label: 'Brand',
    key: 'brand',
    sample: 'Sigma Aldrich',
    description:
      "Only alphabets, numbers, spaces, and symbols (-/,'.+) are allowed.",
  },
  {
    label: 'Notes',
    key: 'notes',
    sample: 'Handle with care',
    description: 'Additional notes for the chemical.',
  },
]

const ID_REGEX = /^[a-f\d]{24}$/i
const CAS_REGEX = /^\b[1-9]{1}[0-9]{1,6}-\d{2}-\d\b$/
const NAME_REGEX_WITH_NUMBER = /^[a-zA-Z0-9,.'-/]+( [a-zA-Z0-9,.'-/]+)*$/
const STATE = ['solid', 'liquid', 'gas']
const UNIT = ['kg', 'g', 'mg', 'L', 'mL']
const NUMBER_REGEX = /^\d{1,}(\.\d{1,2})?$/
const STORAGE_CLASSES_CODE = STORAGE_CLASSES.map((storage_class) =>
  storage_class.code.toLowerCase()
)
const CHEMICAL_STATUS = [
  'normal',
  'low amount',
  'expiring soon',
  'expired',
  'disposed',
]
const DATE_REGEX = /^(0?[1-9]|[12][0-9]|3[01])[/](0?[1-9]|1[012])[/]\d{4}$/

const Validate = (key, value) => {
  switch (key) {
    case '_id':
      return value === '' ? true : ID_REGEX.test(value)
    case 'CASNo':
      return CAS_REGEX.test(value)
    case 'name':
      return NAME_REGEX_WITH_NUMBER.test(value)
    case 'state':
      return STATE.includes(value.toLowerCase())
    case 'unit':
      return UNIT.includes(value)
    case 'containerSize':
    case 'amount':
    case 'minAmount':
      return NUMBER_REGEX.test(value)
    case 'location':
      return value === '' ? true : NAME_REGEX_WITH_NUMBER.test(value)
    case 'storageClass':
      return value === ''
        ? true
        : STORAGE_CLASSES_CODE.includes(value.toLowerCase())
    case 'status':
      return value === '' ? true : CHEMICAL_STATUS.includes(value.toLowerCase())
    case 'dateIn':
    case 'dateOpen':
    case 'expirationDate':
    case 'disposedDate':
      if (value === '' && (key === 'dateOpen' || key === 'disposedDate'))
        return true
      else
        return (
          DATE_REGEX.test(value) &&
          new Date(value.split('/').reverse().join('-')).toString() !==
            'Invalid Date'
        )
    case 'supplier':
    case 'brand':
      return value === '' ? true : NAME_REGEX_WITH_NUMBER.test(value)
    default:
      return true
  }
}

export { COLUMNS, STATUS, HEADERS, Validate }
