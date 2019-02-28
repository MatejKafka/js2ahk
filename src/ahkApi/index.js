module.exports.functions = {
	win: require('./win').functions,

	runProgram: require('./runProgram'),
	if: require('./if'),
	remap: require('./remap'),
}


class PublicApi {
	/**
	 * @property win
	 * @type {PublicApi_win}
	 */
	win = require('./win').PublicApi

	/**
	 * @param {string} pathToExe
	 * @returns {AhkLeafNode}
	 */
	runProgram(pathToExe) {}

	/**
	 * Transpiles to If (cond) {
	 *     trueCb
	 * } else {
	 *     falseCb
	 * }
	 *
	 * @param {function()} cond
	 * @param {function()} trueCb
	 * @param {function()} falseCb
	 * @returns {AhkIfNode}
	 */
	if(cond, trueCb, falseCb) {}

	/**
	 * @typedef {string|[string]} KeyCombination
	 */

	/**
	 * Implementation of AHK remap (key::remapped)
	 *
	 * @param {KeyCombination} keyCombination
	 * @param {KeyCombination|function()} action
	 * @returns {AhkHotkeyNode|AhkRemapNode}
	 */
	remap(keyCombination, action) {}
}

module.exports.PublicApi = PublicApi