const AhkNode = require('../AhkNode')
const {FnInputValue, NullInputValue} = require('../InputValue')
const strFromChildNodes = require('../util/strFromChildNodes')

class AhkIfNode extends AhkNode {
	/**
	 * @param {AhkNode} cond
	 * @param {AhkNode[]} ifNodes
	 * @param {AhkNode[]|null} elseNodes
	 */
	constructor(cond, ifNodes, elseNodes) {
		super()
		this._condition = cond
		this._ifNodes = ifNodes
		this._elseNodes = elseNodes
	}

	toString() {
		let out =
			'If (' + this._condition.toString() + ') {' + '\n'
			+ strFromChildNodes(this._ifNodes) + '\n'
			+ '}'

		if (this._elseNodes != null) {
			out +=
				' else {' + '\n'
				+ strFromChildNodes(this._elseNodes) + '\n'
				+ '}'
		}
		return out
	}
}


/**
 * @param {FnInputValue} cond
 * @param {FnInputValue} trueCb
 * @param {NullInputValue|FnInputValue} falseCb
 * @returns {AhkIfNode}
 */
module.exports = (cond, trueCb, falseCb) => {
	const condNodes = cond.readEvaluatedFn()
	if (condNodes.length !== 1) {
		throw new Error('ahk.if - condition must be a single expression!')
	}

	return new AhkIfNode(
		condNodes[0],
		trueCb.readEvaluatedFn(),
		falseCb instanceof NullInputValue
			? null
			: falseCb.readEvaluatedFn(),
	)
}