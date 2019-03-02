const {InputValue, ArrayInputValue, PrimitiveInputValue, FnInputValue} = require('./InputValue')
const AhkTree = require('./AhkTree')


/**
 * @param {AhkTree} ahkTree
 * @param {object} obj
 * @param {string} path
 * @return {*}
 */
module.exports = (ahkTree, obj, path) => {
	/**
	 * @param fn
	 * @return {AhkNode[]}
	 */
	const bufferFnOutput = (fn) => {
		const oldBlocks = ahkTree
		ahkTree = new AhkTree()
		fn()
		const result = ahkTree
		ahkTree = oldBlocks
		return result.children
	}

	return new Proxy(obj, {
		get: (wrappedObj, prop) => {
			if (!(prop in wrappedObj)) {
				throw new Error('Unknown AHK function: ' + path + '.' + prop)
			}

			if (wrappedObj[prop] instanceof Function) {
				return (...args) => {
					/**
					 * @type {InputValue[]}
					 */
					const evaluatedArgs = args
						.map(arg => {
							if (!(arg instanceof Function)) {
								if (Array.isArray(arg)) {
									return new ArrayInputValue(arg)
								} else {
									return new PrimitiveInputValue(arg)
								}
							}
							return new FnInputValue(bufferFnOutput(arg))
						})

					const out = wrappedObj[prop].apply(wrappedObj, evaluatedArgs)
					ahkTree.addChild(out)
					return out
				}
			} else if (typeof wrappedObj[prop] === 'object') {
				return module.exports(ahkTree, wrappedObj[prop], path + '.' + prop)
			} else {
				return wrappedObj[prop]
			}
		}
	})
}