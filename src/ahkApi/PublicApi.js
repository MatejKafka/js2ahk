// noinspection JSUnusedGlobalSymbols
/**
 * @alias ahk
 */
export default class PublicApi {
	// noinspection FunctionNamingConventionJS
	/**
	 * Due to the way `js2ahk` works, you cannot use normal `if` statements,
	 * as they won't transpile.
	 * The function accepts 3 callbacks: `condFn` should contain single statement
	 * and it's the condition for the AHK If statement. `ifBranchFn` contains the
	 * code that will be executed if the condition is correct. Similarly for `elseBranchFn`.
	 *
	 * Transpiles to If (cond) {
	 *     trueCb
	 * } else {
	 *     falseCb
	 * }
	 *
	 * @example
	 * ahk.if(() => ahk.win.exist('exe', 'program.exe'),
	 *     () => {
	 *         // will be transpiled to the if branch
	 *     },
	 *     () => {
	 *         // will be transpiled to the else branch
	 *     }
	 * )
	 *
	 * @example
	 * ahk.if(() => ahk.win.exist('exe', 'Firefox.exe'),
	 *     () => {
	 *         ahk.win.activate('exe', 'Firefox.exe')
	 *     },
	 *     () => {
	 *         ahk.runProgram('path/to/firefox/Firefox.exe')
	 *         ahk.win.wait('exe', 'Firefox.exe')
	 *         ahk.win.activate('exe', 'Firefox.exe')
	 *     }
	 * )
	 * // will be transpiled to
	 * // If (WinExist("ahk_exe Firefox.exe")) {
	 * //     WinActivate, ahk_exe Firefox.exe
	 * // } else {
	 * //     Run, path/to/firefox/Firefox.exe
	 * //     WinWait, ahk_exe Firefox.exe
	 * //     WinActivate, ahk_exe Firefox.exe
	 * // }
	 *
	 * @public
	 * @alias ahk.if
	 * @param {function()} cond - This function should only contain single AHK function;
	 *   it will be transpiled to the If statement condition.
	 * @param {function()} trueCb - Will be transpiled into the if branch.
	 * @param {function()} falseCb - Will be transpiled into the else branch.
	 * @returns {AhkIfNode}
	 */
	if(cond, trueCb, falseCb) {}

	/**
	 * Wrapper around the
	 * {@link https://www.autohotkey.com/docs/commands/_If.htm context-sensitive #If directive}.
	 * 
	 * Look at {@link .#ahkif ahk.if} for explanation of the way this function is called.
	 *
	 * @public
	 * @alias ahk.ifCtx
	 * @param {function()} cond - This function should only contain single AHK function;
	 *   it will be transpiled to the #If statement condition.
	 * @param {function()} trueCb - Statements in this function will be transpiled into
	 *   the if branch - hotkeys defined here will only be active when the condition is true.
	 * @returns {AhkIfCtxNode}
	 */
	ifCtx(cond, trueCb) {}

	/**
	 * @public
	 * @alias ahk.remap.KeyCombination
	 * @typedef {string|string[]} KeyCombination
	 */

	/**
	 * @summary Implementation of AHK remap (key::remapped)
	 *
	 * @example
	 * ahk.remap(['Ctrl', 'Alt', 'f'], () => ahk.win.activate('exe', 'Firefox.exe'))
	 * // will be transpiled to
	 * //
	 * // ^!f::
	 * //     WinActivate, ahk_exe Firefox.exe
	 * // return
	 *
	 *
	 * @public
	 * @alias ahk.remap
	 * @param {KeyCombination} keyCombination - List of trigger keys (for modifiers like ctrl,
	 *   use `"Ctrl"`, not the single-character shortcuts from AHK).
	 * @param {KeyCombination|function()} action - Either a callback, that contains code that
	 *   will get executed after the trigger combination is pressed, or an array of keys,
	 *   which will be triggered by the original trigger combination.
	 * @param {boolean} shouldCombine - set to false if you do not want to remap combinations
	 *   that include other keys (e.g. if your hotkey is a::b, ctrl+a will be by default remapped
	 *   to ctrl+b; with this set to false, the remap will not trigger and ctrl+a will be passed on).
	 * @returns {AhkHotkeyNode|AhkRemapNode}
	 */
	remap(keyCombination, action, shouldCombine = true) {}

	/**
	 * Wrapper around {@link https://autohotkey.com/docs/commands/Run.htm Run}.
	 * Runs program specified by the argument.
	 *
	 * @public
	 * @alias ahk.runProgram
	 * @param {string} pathToExe
	 * @returns {AhkLeafNode}
	 */
	runProgram(pathToExe) {}

	/**
	 * Wrapper around {@link https://autohotkey.com/docs/commands/Run.htm Run}.
	 * Runs program specified by the argument.
	 *
	 * @public
	 * @alias ahk.raw
	 * @param {string} ahkCode
	 * @returns {AhkRawNode}
	 */
	raw(ahkCode) {}

	// noinspection JSUnusedGlobalSymbols
	constructor() {
		this.win = new PublicApi_Win()
	}
}


class PublicApi_Win {
	// noinspection JSUnusedGlobalSymbols
	/**
	 * Wrapper around {@link https://autohotkey.com/docs/commands/WinExist.htm WinExist}.
	 *
	 * Currently, only the first ({@link https://autohotkey.com/docs/misc/WinTitle.htm WinTitle}) argument is supported.
	 * Support for other arguments like window content might be added if deemed useful enough.
	 *
	 *
	 * @example
	 * ahk.win.exist(null, 'A') // current active window
	 * @example
	 * ahk.win.exist('exe', 'program.exe') // matches running program with given executable name
	 * @example
	 * ahk.win.exist() // last used window
	 *
	 * @public
	 * @alias ahk.win.exist
	 * @param {null|string} [identifierType]
	 *   Gets transpiled into the `ahk_<type>` specifier;
	 *   valid values are `"class"`, `"id"`, `"pid"`, `"exe"`, `"group"`
	 *   or `null` (for special identifiers like `A`).
	 * @param {string} [identifier]
	 *   The `identifier` identifies the window you are working with, see more here:
	 *   {@link https://www.autohotkey.com/docs/misc/WinTitle.htm WinTitle}
	 * @returns {AhkLeafNode}
	 */
	exist(identifierType, identifier) {}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Wrapper around {@link https://autohotkey.com/docs/commands/WinActive.htm WinActive}.
	 *
	 * Read more about arguments at {@link .#ahkwinexist ahk.win.exist}
	 *
	 * @public
	 * @alias ahk.win.active
	 * @param {null|string} [identifierType]
	 * @param {string} [identifier]
	 * @returns {AhkLeafNode}
	 */
	active(identifierType, identifier) {}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Wrapper around {@link https://autohotkey.com/docs/commands/WinActivate.htm WinActivate}.
	 *
	 * Read more about arguments at {@link .#ahkwinexist ahk.win.exist}
	 *
	 * @public
	 * @alias ahk.win.activate
	 * @param {null|string} [identifierType]
	 * @param {string} [identifier]
	 * @returns {AhkLeafNode}
	 */
	activate(identifierType, identifier) {}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Wrapper around {@link https://autohotkey.com/docs/commands/WinMinimize.htm WinMinimize}.
	 *
	 * Read more about arguments at {@link .#ahkwinexist ahk.win.exist}
	 *
	 * @public
	 * @alias ahk.win.minimize
	 * @param {null|string} [identifierType]
	 * @param {string} [identifier]
	 * @returns {AhkLeafNode}
	 */
	minimize(identifierType, identifier) {}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Wrapper around {@link https://autohotkey.com/docs/commands/WinMaximize.htm WinMaximize}.
	 *
	 * Read more about arguments at {@link .#ahkwinexist ahk.win.exist}
	 *
	 * @public
	 * @alias ahk.win.maximize
	 * @param {null|string} [identifierType]
	 * @param {string} [identifier]
	 * @returns {AhkLeafNode}
	 */
	maximize(identifierType, identifier) {}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Wrapper around {@link https://autohotkey.com/docs/commands/WinWait.htm WinWait}.
	 *
	 * Read more about arguments at {@link .#ahkwinexist ahk.win.exist}
	 *
	 * @public
	 * @alias ahk.win.wait
	 * @param {null|string} [identifierType]
	 * @param {string} [identifier]
	 * @returns {AhkLeafNode}
	 */
	wait(identifierType, identifier) {}
}