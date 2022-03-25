const STORAGE_GROUPS = [
	{
		code: 'A',
		description: 'Compatible Organic Bases',
		allowed: ['A', 'D', 'G', 'L'],
	},
	{
		code: 'B',
		description: 'Compatible Pyrophoric and Water Reactive Materials',
		allowed: ['B'],
	},
	{
		code: 'C',
		description: 'Compatible Inorganic Bases',
		allowed: ['C', 'E', 'F', 'G'],
	},
	{
		code: 'D',
		description: 'Compatible Organic Acids',
		allowed: ['A', 'D', 'G', 'L'],
	},
	{
		code: 'E',
		description: 'Compatible Oxidizers including Peroxides',
		allowed: ['C', 'E', 'F', 'G'],
	},
	{
		code: 'F',
		description:
			'Compatible Inorganic Acids not including Oxidizers or Combustibles',
		allowed: ['C', 'E', 'F', 'G'],
	},
	{
		code: 'G',
		description: 'Not Intrinsically Reactive or Flammable or Combustible',
		allowed: ['A', 'C', 'D', 'E', 'F', 'G', 'L'],
	},
	{
		code: 'J',
		description: 'Poison Compressed Gases',
		allowed: ['J'],
	},
	{
		code: 'K',
		description: 'Compatible Explosive or other Highly Unstable Materials',
		allowed: ['K'],
	},
	{
		code: 'L',
		description: 'Non-Reactive Flammables and Combustibles, including solvents',
		allowed: ['A', 'D', 'G', 'L'],
	},
	{
		code: 'X',
		description: 'Incompatible with All Other Storage Groups',
		allowed: ['X'],
	},
]

export default STORAGE_GROUPS
