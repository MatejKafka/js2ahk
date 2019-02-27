const {PrimitiveInputValue, ArrayInputValue} = require('../InputValue')

/**
 * @param {PrimitiveInputValue|ArrayInputValue} input
 * @returns {[]}
 */
module.exports = (input) => {
	if (input instanceof PrimitiveInputValue) {
		return [input.readPrimitive()]
	} else {
		return input.readArray()
	}
}