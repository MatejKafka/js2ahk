const AhkNode = require('../AhkNode')
const extractInputArray = require('../util/extractInputArray')
const strFromChildNodes = require('../util/strFromChildNodes')
const {procedure} = require('../ahkFn')
const {FnInputValue, PrimitiveInputValue, ArrayInputValue, NullInputValue, InputValue} = require('../InputValue')


/**
 * @private
 */
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
	 * @param {AhkHotkeyNode[]} hotkeyNodes
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
	'Alt': '!',
	'Ctrl': '^',
	'Shift': '+',
	'Win': '#'
}

const lookup = (obj) => (val) => val in obj ? obj[val] : null

/**
 * @private
 * @param {string[]} keyArr
 * @param decoratorFn
 * @returns {string}
 */
const getSendKeyStr = (keyArr, decoratorFn) =>
	keyArr
		.map(str => str.replace(/([\%\`\;])/g, "`$1"))
		.map(decoratorFn)
		.map(key => '{' + key + '}')
		.join('')


/**
 * @private
 * @param {string} triggerStr
 * @param {string} sendStr
 * @returns {AhkHotkeyNode}
 */
const generateHotkeyRemap = (triggerStr, sendStr) => {
	// TODO: actually, AHK has special handling for some interesting edge cases, see more here:
	// https://autohotkey.com/docs/misc/Remap.htm#actually
	return new AhkHotkeyNode(
		triggerStr,
		[procedure('SendInput')(['{Blind}' + sendStr])]
	)
}

const generateHotkey_opening = (triggerStr, remapped) => {
	const sendStr = getSendKeyStr(remapped, key => key + ' Down')
	return generateHotkeyRemap(triggerStr, sendStr)
}

const generateHotkey_closing = (triggerStr, remapped) => {
	const sendStr = getSendKeyStr(remapped, key => key + ' Up')
	return generateHotkeyRemap(triggerStr + ' Up', sendStr)
}

/**
 * @private
 * @param {string} triggerStr
 * @param {string[]} remapped
 * @returns {AhkRemapNode}
 */
const generateHotkey = (triggerStr, remapped) => {
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
 * @private
 */
const escapeAhkTriggerStr = str => {
	// do not replace , with `, - AHK is stupid
	// and thinks it is an invalid hotkey
	// for hotkeys, do not escape ` either, not sure why
	return str.replace(/([\%\;])/g, "`$1")
}


/**
 * @private
 * @param {string[]} keys
 * @param {boolean} shouldCombine
 * @returns {string}
 */
const stringifyKeyCombination = (keys, shouldCombine) => {
	let normalKeys = []
	let modifierKeys = []
	keys
		.forEach((key) => {
			if (key in MODIFIER_KEY_MAPPING) {
				modifierKeys.push(key)
			} else {
				normalKeys.push(escapeAhkTriggerStr(key))
			}
		})

	if (normalKeys.length === 0) {
		normalKeys = modifierKeys
		modifierKeys = []
	}

	return (shouldCombine ? "*" : "")
		+ modifierKeys
			.map(lookup(MODIFIER_KEY_MAPPING))
			.join('')
		+ normalKeys.join(' & ')
}


/**
 * @param {PrimitiveInputValue|ArrayInputValue} keyCombination
 * @param {InputValue} cb
 * @param {PrimitiveInputValue|NullInputValue} shouldCombine
 * @returns {AhkHotkeyNode|AhkRemapNode}
 */
module.exports = (keyCombination, cb, shouldCombine) => {
	const keyCombinationValue = extractInputArray(keyCombination)
	
	const shouldCombineVal = shouldCombine instanceof NullInputValue
		? false
		: shouldCombine.readPrimitive()

	const triggerStr = stringifyKeyCombination(keyCombinationValue, shouldCombineVal)

	if (cb instanceof FnInputValue) {
		return new AhkHotkeyNode(
			triggerStr,
			[
				cb.readEvaluatedFn()
			]
		)
	} else if (cb instanceof PrimitiveInputValue || cb instanceof ArrayInputValue) {
		return generateHotkey(
			triggerStr,
			extractInputArray(cb)
		)
	}
}