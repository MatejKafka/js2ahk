const wrapWinTitleFn = require('./util/wrapWinTitleFn')
const {fn, procedure} = require('../ahkFn')


module.exports = {
	exist: wrapWinTitleFn(fn('WinExist')),
	active: wrapWinTitleFn(fn('WinActive')),
	activate: wrapWinTitleFn(procedure('WinActivate')),
	minimize: wrapWinTitleFn(procedure('WinMinimize')),
	maximize: wrapWinTitleFn(procedure('WinMaximize')),
	wait: wrapWinTitleFn(procedure('WinWait'))
}