const AhkTree = require('./src/AhkTree')
const constructAhkProxy = require('./src/constructAhkProxy')
const fs = require('fs')
const ahkFunctions = require('./src/ahkApi')


const processResult = (filePath, ahkTree) => {
	if (filePath == null) {
		return ahkTree
	}
	fs.writeFileSync(filePath, ahkTree.toString())
	return ahkTree
}


module.exports = (filePath, scriptFn) => {
	let ahkTree = new AhkTree()
	const ahk = constructAhkProxy(ahkTree, ahkFunctions, 'ahk')

	const result = scriptFn(ahk)
	if (result instanceof Promise) {
		return result
			.then(() => processResult(filePath, ahkTree))
	} else {
		return processResult(filePath, ahkTree)
	}
}