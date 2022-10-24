const STORAGE_GROUP_CODES = [
  'A', // 0
  'B', // 1
  'C', // 2
  'D', // 3
  'E', // 4
  'F', // 5
  'G', // 6
  'J', // 7
  'K', // 8
  'L', // 9
  'X', // 10
]

const STORAGE_GROUP_CONFIG = [
  {
    code: 0,
    description: 'Compatible Organic Bases',
    allowed: [0, 3, 6, 9],
  },
  {
    code: 1,
    description: 'Compatible Pyrophoric and Water Reactive Materials',
    allowed: [1],
  },
  {
    code: 2,
    description: 'Compatible Inorganic Bases',
    allowed: [2, 4, 5, 6],
  },
  {
    code: 3,
    description: 'Compatible Organic Acids',
    allowed: [0, 3, 6, 9],
  },
  {
    code: 4,
    description: 'Compatible Oxidizers including Peroxides',
    allowed: [2, 4, 5, 6],
  },
  {
    code: 5,
    description:
      'Compatible Inorganic Acids not including Oxidizers or Combustibles',
    allowed: [2, 4, 5, 6],
  },
  {
    code: 6,
    description: 'Not Intrinsically Reactive or Flammable or Combustible',
    allowed: [0, 2, 3, 4, 5, 6, 9],
  },
  {
    code: 7,
    description: 'Poison Compressed Gases',
    allowed: [7],
  },
  {
    code: 8,
    description: 'Compatible Explosive or other Highly Unstable Materials',
    allowed: [8],
  },
  {
    code: 9,
    description: 'Non-Reactive Flammables and Combustibles, including solvents',
    allowed: [0, 3, 6, 9],
  },
  {
    code: 10,
    description: 'Incompatible with All Other Storage Groups',
    allowed: [10],
  },
]

const STORAGE_GROUPS = STORAGE_GROUP_CONFIG.map((storageGroup) => ({
  code: STORAGE_GROUP_CODES[storageGroup.code],
  description: storageGroup.description,
  allowed: storageGroup.allowed.map((code) => STORAGE_GROUP_CODES[code]),
}))

export { STORAGE_GROUP_CODES, STORAGE_GROUP_CONFIG }
export default STORAGE_GROUPS
