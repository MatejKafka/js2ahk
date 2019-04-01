const {AhkLeafNode} = require('../ahkFn')
const {PrimitiveInputValue} = require('../InputValue')


/**
 * @param {PrimitiveInputValue} str
 * @returns {AhkLeafNode}
 */
module.exports = (str) => {
	return new AhkLeafNode(str.readPrimitive())
}