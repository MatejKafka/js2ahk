const {procedure, AhkLeafNode} = require('../ahkFn')
const {PrimitiveInputValue} = require('../InputValue')


/**
 * @param {PrimitiveInputValue} pathToExe
 * @returns {AhkLeafNode}
 */
module.exports = (pathToExe) => {
	return procedure('Run')([pathToExe.readPrimitive()])
}