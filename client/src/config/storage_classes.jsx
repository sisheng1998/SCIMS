const STORAGE_CLASS_CODES = [
  '1', // 0
  '2A', // 1
  '2B', // 2
  '3', // 3
  '4.1A', // 4
  '4.1B', // 5
  '4.2', // 6
  '4.3', // 7
  '5.1A', // 8
  '5.1B', // 9
  '5.1C', // 10
  '5.2', // 11
  '6.1A', // 12
  '6.1B', // 13
  '6.1C', // 14
  '6.1D', // 15
  '6.2', // 16
  '7', // 17
  '8A', // 18
  '8B', // 19
  '10', // 20
  '11', // 21
  '12', // 22
  '13', // 23
  '10-13', // 24
]

const STORAGE_CLASS_CONFIG = [
  {
    code: 0,
    description: 'Explosive Substances',
    allowed: [0],
  },
  {
    code: 1,
    description: 'Gases',
    allowed: [1, 2, 10, 18, 19, 21, 22, 23, 24],
  },
  {
    code: 2,
    description: 'Aerosol Packages',
    allowed: [1, 2, 3, 10, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 24],
  },
  {
    code: 3,
    description: 'Flammable Liquids',
    allowed: [2, 3, 9, 12, 14, 15, 18, 19, 20, 21, 22, 23, 24],
  },
  {
    code: 4,
    description: 'Other Explosive Substances',
    allowed: [4, 5, 11, 18, 19, 20, 21, 22, 23, 24],
  },
  {
    code: 5,
    description: 'Flammable Solids / Desensitizing Explosive Substances',
    allowed: [4, 5, 6, 7, 9, 11, 12, 14, 15, 18, 19, 20, 21, 22, 23, 24],
  },
  {
    code: 6,
    description: 'Pyrophoric / Self-Igniting Substances',
    allowed: [5, 6, 7, 14, 15, 18, 19, 20, 21, 22, 23, 24],
  },
  {
    code: 7,
    description: 'Substances Producing Oxidizing Gases with Water',
    allowed: [5, 6, 7, 14, 15, 18, 19, 20, 21, 22, 23, 24],
  },
  {
    code: 8,
    description: 'Highly Oxidizing Substances',
    allowed: [8, 9, 22, 23],
  },
  {
    code: 9,
    description: 'Oxidizing Substances',
    allowed: [3, 5, 8, 9, 10, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 24],
  },
  {
    code: 10,
    description: 'Ammonium Nitrate & Mixtures Containing Ammonium Nitrate',
    allowed: [1, 2, 9, 10, 18, 19, 20, 21, 22, 23, 24],
  },
  {
    code: 11,
    description: 'Organic Peroxides & Self-Reactive Substances',
    allowed: [4, 5, 11, 20, 21, 22, 23, 24],
  },
  {
    code: 12,
    description: 'Combustible, Acutely Toxic Substances',
    allowed: [2, 3, 5, 9, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 24],
  },
  {
    code: 13,
    description: 'Non-Combustible Acutely Toxic Substances',
    allowed: [2, 9, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 24],
  },
  {
    code: 14,
    description: 'Combustible Acutely Toxic / Chronic Substances',
    allowed: [2, 3, 5, 6, 7, 9, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 24],
  },
  {
    code: 15,
    description:
      'Non-Combustible Acutely Toxic / Substances with Chronic Effects',
    allowed: [2, 3, 5, 6, 7, 9, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 24],
  },
  {
    code: 16,
    description: 'Infectious Substances',
    allowed: [16],
  },
  {
    code: 17,
    description: 'Radioactive Substances',
    allowed: [17],
  },
  {
    code: 18,
    description: 'Combustible Corrosive Substances',
    allowed: [
      1, 2, 3, 4, 5, 6, 7, 9, 10, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 24,
    ],
  },
  {
    code: 19,
    description: 'Non-Combustible Corrosive Substances',
    allowed: [
      1, 2, 3, 4, 5, 6, 7, 9, 10, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 24,
    ],
  },
  {
    code: 20,
    description: 'Combustible Liquids',
    allowed: [
      2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 24,
    ],
  },
  {
    code: 21,
    description: 'Combustible Solids',
    allowed: [
      1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23,
      24,
    ],
  },
  {
    code: 22,
    description: 'Non-Combustible Liquids',
    allowed: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23,
      24,
    ],
  },
  {
    code: 23,
    description: 'Non-Combustible Solids',
    allowed: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23,
      24,
    ],
  },
  {
    code: 24,
    description: 'Other Combustible & Non-Combustible Substances',
    allowed: [
      1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23,
      24,
    ],
  },
]

const STORAGE_CLASSES = STORAGE_CLASS_CONFIG.map((storageClass) => ({
  code: STORAGE_CLASS_CODES[storageClass.code],
  description: storageClass.description,
  allowed: storageClass.allowed.map((code) => STORAGE_CLASS_CODES[code]),
}))

export { STORAGE_CLASS_CODES, STORAGE_CLASS_CONFIG }
export default STORAGE_CLASSES
