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
		get: (fns, prop) => {
			if (!(prop in fns)) {
				throw new Error('Unknown AHK function: ' + path + '.' + prop)
			}

			if (fns[prop] instanceof Function) {
				return (...args) => {
					/**
					 * @type {[InputValue]}
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

					const out = fns[prop].apply(fns, evaluatedArgs)
					ahkTree.addChild(out)
					return out
				}
			} else {
				return module.exports(ahkTree, fns[prop], path + '.' + prop)
			}
		}
	})
}