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
		label: 'Storage Group',
		value: 'storageGroup',
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
		description: 'Leave the field empty to add new chemicals.',
	},
	{
		label: 'CAS No.*',
		key: 'CASNo',
		sample: '100-00-5',
		description: 'Format: XXXXXXX-YY-Z',
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
		description:
			'Numbers with maximum 2 decimal places only. Not exceed container size.',
	},
	{
		label: 'Minimum Amount*',
		key: 'minAmount',
		sample: '0.1',
		description:
			'Numbers with maximum 2 decimal places only. Not exceed container size.',
	},
	{
		label: 'Location',
		key: 'location',
		sample: 'Cabinet A',
		description: "Chemical's location in the current lab.",
	},
	{
		label: 'Storage Group',
		key: 'storageGroup',
		sample: 'A',
		description: 'A, B, C, D, E, F, G, J, K, L, or X only.',
	},
	{
		label: 'Status',
		key: 'status',
		sample: 'Normal',
		description: 'Leave it empty to let system decide the status.',
	},
	{
		label: 'Date In*',
		key: 'dateIn',
		sample: '30/11/2021',
		description: 'Not greater than today. Format: DD/MM/YYYY',
	},
	{
		label: 'Date Open',
		key: 'dateOpen',
		sample: '02/01/2022',
		description: 'Not greater than today. Format: DD/MM/YYYY',
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
			'Leave it empty if the chemical is not yet dispose. Format: DD/MM/YYYY',
	},
	{
		label: 'Supplier',
		key: 'supplier',
		sample: 'Merck',
		description: 'Name of the supplier.',
	},
	{
		label: 'Brand',
		key: 'brand',
		sample: 'Sigma Aldrich',
		description: 'Name of the brand.',
	},
	{
		label: 'Notes',
		key: 'notes',
		sample: 'Handle with care',
		description: 'Additional notes for the chemical.',
	},
]

export { COLUMNS, STATUS, HEADERS }
