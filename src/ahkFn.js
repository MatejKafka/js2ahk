const AhkNode = require('./AhkNode')


class AhkLeafNode extends AhkNode {
	constructor(value) {
		super()
		this.value = value
	}

	toString() {
		return this.value
	}
}

module.exports.AhkLeafNode = AhkLeafNode


/**
 * @param {string} name
 * @returns {function([]):AhkLeafNode}
 */
module.exports.procedure = name => args => {
	if (args == null || args.filter(a => a != null).length === 0)
		return name

	return new AhkLeafNode(name + ', ' + args.join(', '))
}

/**
 * @param {string} name
 * @returns {function([]):AhkLeafNode}
 */
module.exports.fn = name => args => {
	const argStr = args
		.map(arg => typeof arg === 'string'
			? '"' + arg + '"'
			: arg
		)
		.join(', ')

	return new AhkLeafNode(name + '(' + argStr + ')')
}