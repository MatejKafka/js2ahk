const {procedure} = require('../ahkFn')
const {PrimitiveInputValue} = require('../InputValue')
const AhkNode = require('../AhkNode')

/**
 * @param {PrimitiveInputValue} pathToExe
 * @returns {AhkNode}
 */
module.exports = (pathToExe) => {
	return procedure('Run')([pathToExe.readPrimitive()])
}
