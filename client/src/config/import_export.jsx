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
	},
	{
		label: 'CAS No.*',
		key: 'CASNo',
		sample: '100-00-5',
	},
	{
		label: 'Name*',
		key: 'name',
		sample: '1-Chloro-4-Nitrobenzene',
	},
	{
		label: 'State*',
		key: 'state',
		sample: 'Liquid',
	},
	{
		label: 'Unit*',
		key: 'unit',
		sample: 'L',
	},
	{
		label: 'Container Size*',
		key: 'containerSize',
		sample: '1.5',
	},
	{
		label: 'Amount*',
		key: 'amount',
		sample: '0.75',
	},
	{
		label: 'Minimum Amount*',
		key: 'minAmount',
		sample: '0.1',
	},
	{
		label: 'Location',
		key: 'location',
		sample: 'Cabinet A',
	},
	{
		label: 'Storage Group',
		key: 'storageGroup',
		sample: 'A',
	},
	{
		label: 'Status',
		key: 'status',
		sample: 'Normal',
	},
	{
		label: 'Date In*',
		key: 'dateIn',
		sample: '30/11/2021',
	},
	{
		label: 'Date Open',
		key: 'dateOpen',
		sample: '02/01/2022',
	},
	{
		label: 'Expiration Date*',
		key: 'expirationDate',
		sample: '01/02/2024',
	},
	{
		label: 'Disposed Date',
		key: 'disposedDate',
		sample: '30/06/2022',
	},
	{
		label: 'Supplier',
		key: 'supplier',
		sample: 'Merck',
	},
	{
		label: 'Brand',
		key: 'brand',
		sample: 'Sigma Aldrich',
	},
	{
		label: 'Notes',
		key: 'notes',
		sample: 'Handle with care',
	},
]

export { COLUMNS, STATUS, HEADERS }
