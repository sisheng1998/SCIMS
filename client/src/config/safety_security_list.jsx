import GHS01 from '../images/GHS01.svg'
import GHS02 from '../images/GHS02.svg'
import GHS03 from '../images/GHS03.svg'
import GHS04 from '../images/GHS04.svg'
import GHS05 from '../images/GHS05.svg'
import GHS06 from '../images/GHS06.svg'
import GHS07 from '../images/GHS07.svg'
import GHS08 from '../images/GHS08.svg'
import GHS09 from '../images/GHS09.svg'

const CLASSIFICATION_LIST = [
	'Explosive',
	'Flammable',
	'Oxidizer',
	'Compressed Gas',
	'Corrosive',
	'Acute Toxicity',
	'Irritant',
	'Health Hazard',
	'Environment',
]

const CLASSIFICATION_ICON = [
	GHS01,
	GHS02,
	GHS03,
	GHS04,
	GHS05,
	GHS06,
	GHS07,
	GHS08,
	GHS09,
]

const COC_LIST = ['CWC', 'CFATS', 'EU', 'AG', 'WMD', 'Other']

const COC_DESCRIPTION = [
	'Chemical Weapons Convention',
	'Chemical Facility Anti-Terrorism Standards',
	'Council Regulation (EC) No 428/2009 of 5 May 2009',
	'Australia Group',
	'Weapons of Mass Destruction',
	'-',
]

const HAZARD_CODES = [
	['h204', 'h209', 'h210', 'h211', 'h240', 'h241'], // explosive
	[
		'h206',
		'h207',
		'h208',
		'h220',
		'h221',
		'h222',
		'h224',
		'h225',
		'h226',
		'h228',
		'h229',
		'h231',
		'h232',
		'h241',
		'h242',
		'h250',
		'h251',
		'h252',
		'h260',
		'h261',
		'h282',
		'h283',
	], // flammable
	['h270', 'h271', 'h272'], // oxidizer
	['h280', 'h281', 'h282', 'h283', 'h284'], // compressed gas
	['h290', 'h314', 'h318'], // corrosive
	['h300', 'h301', 'h310', 'h311', 'h330', 'h331'], // acute toxicity
	[
		'h204',
		'h302',
		'h312',
		'h315',
		'h317',
		'h319',
		'h332',
		'h335',
		'h336',
		'h420',
	], // irritant
	[
		'h304',
		'h305',
		'h334',
		'h340',
		'h341',
		'h350',
		'h351',
		'h360',
		'h361',
		'h370',
		'h371',
		'h372',
		'h373',
	], // health hazard
	['h400', 'h410', 'h411'], // environment
]

export {
	CLASSIFICATION_LIST,
	CLASSIFICATION_ICON,
	COC_LIST,
	COC_DESCRIPTION,
	HAZARD_CODES,
}
