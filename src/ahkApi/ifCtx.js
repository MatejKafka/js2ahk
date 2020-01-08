const AhkNode = require('../AhkNode')
const {FnInputValue} = require('../InputValue')
const strFromChildNodes = require('../util/strFromChildNodes')

class AhkIfCtxNode extends AhkNode {
	/**
	 * @param {AhkNode} cond
	 * @param {AhkNode[]} ifNodes
	 */
	constructor(cond, ifNodes) {
		super()
		this._condition = cond
		this._ifNodes = ifNodes
	}

	toString() {
		return '#If ' + this._condition.toString() + '\n'
			+ strFromChildNodes(this._ifNodes) + '\n'
			+ '#If'
	}
}


/**
 * @param {FnInputValue} cond
 * @param {FnInputValue} trueCb
 * @returns {AhkIfNode}
 */
module.exports = (cond, trueCb) => {
	const condNodes = cond.readEvaluatedFn()
	if (condNodes.length !== 1) {
		throw new Error('ahk.ifCtx - condition must be a single expression!')
	}

	return new AhkIfCtxNode(
		condNodes[0],
		trueCb.readEvaluatedFn(),
	)
}