const AhkNode = require('../AhkNode')
const extractInputArray = require('../util/extractInputArray')
const strFromChildNodes = require('../util/strFromChildNodes')
const {procedure} = require('../ahkFn')
const {FnInputValue, PrimitiveInputValue, ArrayInputValue, InputValue} = require('../InputValue')


class AhkHotkeyNode extends AhkNode {
	constructor(triggerStr, cbNodes) {
		super()
		this._triggerStr = triggerStr
		this._cbNodes = cbNodes
	}

	toString() {
		return this._triggerStr + '::' + '\n'
			+ strFromChildNodes(this._cbNodes) + '\n'
			+ 'return'
	}
}

class AhkRemapNode extends AhkNode {
	/**
	 * @param {string} triggerStr
	 * @param {string} remappedStr
	 * @param {[AhkHotkeyNode]} hotkeyNodes
	 */
	constructor(triggerStr, remappedStr, hotkeyNodes) {
		super()
		this._triggerStr = triggerStr
		this._remappedStr = remappedStr
		this._hotkeyNodes = hotkeyNodes
	}

	toString() {
		return '; hotkey: ' + this._triggerStr + '::' + this._remappedStr + '\n'
			+ strFromChildNodes(this._hotkeyNodes)
	}
}


const MODIFIER_KEY_MAPPING = {
	'alt': '!',
	'ctrl': '^',
	'shift': '+',
	'win': '#'
}

const lookup = (obj) => (val) => val in obj ? obj[val] : null

/**
 * @param {string} key
 * @returns {string}
 */
const getKeyName = (key) =>
	key.length > 1
		? key.split('_')
			.map(part =>
				part[0].toUpperCase() + part.slice(1)
			)
			.join('_')
		: key


/**
 * @param {[string]} keyArr
 * @param decoratorFn
 * @returns {string}
 */
const getSendKeyStr = (keyArr, decoratorFn) =>
	keyArr
		.map(getKeyName)
		.map(decoratorFn)
		.map(key => '{' + key + '}')
		.join('')


/**
 *
 * @param {string} triggerStr
 * @param {string} sendStr
 * @returns {AhkHotkeyNode}
 */
const generateHotkeyRemap = (triggerStr, sendStr) => {
	// TODO: actually, AHK has special handling for some interesting edge cases, see more here:
	// https://autohotkey.com/docs/misc/Remap.htm#actually
	return new AhkHotkeyNode(
		triggerStr,
		[
			procedure('SetKeyDelay')([-1]),
			procedure('Send')(['{Blind}' + sendStr])
		]
	)
}

const generateHotkey_opening = (triggerStr, remapped) => {
	const sendStr = getSendKeyStr(remapped, key => key + ' DownR')
	return generateHotkeyRemap(triggerStr, sendStr)
}

const generateHotkey_closing = (triggerStr, remapped) => {
	const sendStr = getSendKeyStr(remapped, key => key + ' up')
	return generateHotkeyRemap(triggerStr + ' up', sendStr)
}

/**
 *
 * @param {[string]} triggerKeys
 * @param {[string]} remapped
 * @returns {AhkRemapNode}
 */
const generateHotkey = (triggerKeys, remapped) => {
	const triggerStr = stringifyKeyCombination(triggerKeys)
	return new AhkRemapNode(
		triggerStr,
		stringifyKeyCombination(remapped),
		[
			generateHotkey_opening(triggerStr, remapped),
			generateHotkey_closing(triggerStr, remapped)
		]
	)
}


/**
 * @param {[string]} keys
 * @returns {string}
 */
const stringifyKeyCombination = (keys) => {
	let normalKeys = []
	let modifierKeys = []
	keys
		.forEach((key) => {
			if (key in MODIFIER_KEY_MAPPING) {
				modifierKeys.push(key)
			} else {
				normalKeys.push(getKeyName(key))
			}
		})

	if (normalKeys.length === 0) {
		normalKeys = modifierKeys.map(getKeyName)
		modifierKeys = []
	}

	return modifierKeys
		.map(lookup(MODIFIER_KEY_MAPPING))
		.join('')
		+ normalKeys.join(' & ')
}


/**
 * @param {PrimitiveInputValue|ArrayInputValue} keyCombination
 * @param {InputValue} cb
 * @returns {AhkHotkeyNode|AhkRemapNode}
 */
module.exports = (keyCombination, cb) => {
	const keyCombinationValue = extractInputArray(keyCombination)

	if (cb instanceof FnInputValue) {
		return new AhkHotkeyNode(
			stringifyKeyCombination(keyCombinationValue),
			[
				cb.readEvaluatedFn()
			]
		)
	} else if (cb instanceof PrimitiveInputValue || cb instanceof ArrayInputValue) {
		return generateHotkey(
			keyCombinationValue,
			extractInputArray(cb)
		)
	}
}