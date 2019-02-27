class AhkTree {
	/**
	 * @property {[AhkNode]} children
	 */

	constructor () {
		this.children = []
	}

	/**
	 * @param {AhkNode} child
	 */
	addChild(child) {
		this.children.push(child)
	}

	toString() {
		return this.children
			.map(c => c.toString())
			.join('\n\n')
	}
}

module.exports = AhkTree