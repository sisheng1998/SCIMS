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
	},
	{
		label: 'CAS No.*',
		key: 'CASNo',
	},
	{
		label: 'Name*',
		key: 'name',
	},
	{
		label: 'State*',
		key: 'state',
	},
	{
		label: 'Unit*',
		key: 'unit',
	},
	{
		label: 'Container Size*',
		key: 'containerSize',
	},
	{
		label: 'Amount*',
		key: 'amount',
	},
	{
		label: 'Minimum Amount*',
		key: 'minAmount',
	},
	{
		label: 'Location',
		key: 'location',
	},
	{
		label: 'Storage Group',
		key: 'storageGroup',
	},
	{
		label: 'Status',
		key: 'status',
	},
	{
		label: 'Date In*',
		key: 'dateIn',
	},
	{
		label: 'Date Open',
		key: 'dateOpen',
	},
	{
		label: 'Expiration Date*',
		key: 'expirationDate',
	},
	{
		label: 'Disposed Date',
		key: 'disposedDate',
	},
	{
		label: 'Supplier',
		key: 'supplier',
	},
	{
		label: 'Brand',
		key: 'brand',
	},
	{
		label: 'Notes',
		key: 'notes',
	},
]

export { COLUMNS, STATUS, HEADERS }
