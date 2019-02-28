const wrapWinTitleFn = require('./util/wrapWinTitleFn')
const {fn, procedure, AhkLeafNode} = require('../ahkFn')


module.exports.functions = {
	exist: wrapWinTitleFn(fn('WinExist')),
	active: wrapWinTitleFn(fn('WinActive')),
	activate: wrapWinTitleFn(procedure('WinActivate')),
	minimize: wrapWinTitleFn(procedure('WinMinimize')),
	maximize: wrapWinTitleFn(procedure('WinMaximize')),
	wait: wrapWinTitleFn(procedure('WinWait'))
}


class PublicApi_win {
	/**
	 * @param {null|string} identifierType
	 * @param {string} identifier
	 * @returns AhkLeafNode
	 */
	exist(identifierType, identifier) {}

	/**
	 * @param {null|string} identifierType
	 * @param {string} identifier
	 * @returns AhkLeafNode
	 */
	active(identifierType, identifier) {}

	/**
	 * @param {null|string} identifierType
	 * @param {string} identifier
	 * @returns AhkLeafNode
	 */
	activate(identifierType, identifier) {}

	/**
	 * @param {null|string} identifierType
	 * @param {string} identifier
	 * @returns AhkLeafNode
	 */
	minimize(identifierType, identifier) {}

	/**
	 * @param {null|string} identifierType
	 * @param {string} identifier
	 * @returns AhkLeafNode
	 */
	maximize(identifierType, identifier) {}

	/**
	 * @param {null|string} identifierType
	 * @param {string} identifier
	 * @returns AhkLeafNode
	 */
	wait(identifierType, identifier) {}
}

module.exports.PublicApi = PublicApi_win