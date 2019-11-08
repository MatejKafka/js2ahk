const AhkTree = require('./src/AhkTree')
const constructAhkProxy = require('./src/constructAhkProxy')
const fs = require('fs')
const ahkFunctions = require('./src/ahkApi')


const processResult = (filePath, ahkTree) => {
	if (filePath == null) {
		return ahkTree
	}
	//						   \|/ utf8 BOM - ahk needs it for some reason
	fs.writeFileSync(filePath, "\ufeff" + ahkTree.toString(), {encoding: "utf8"})
	return ahkTree
}

/**
 *
 * @param filePath
 * @param {function(ahk)} scriptFn
 * @return {Promise<AhkTree>|AhkTree}
 */
module.exports = (filePath, scriptFn) => {
	let ahkTree = new AhkTree()

	/**
	 * @type {ahk}
	 */
	const ahk = constructAhkProxy(ahkTree, ahkFunctions, 'ahk')

	const result = scriptFn(ahk)
	if (result instanceof Promise) {
		return result
			.then(() => processResult(filePath, ahkTree))
	} else {
		return processResult(filePath, ahkTree)
	}
}