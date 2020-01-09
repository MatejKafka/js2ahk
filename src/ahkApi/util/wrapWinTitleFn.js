const {PrimitiveInputValue, NullInputValue} = require('../../InputValue')
const AhkNode = require('../../AhkNode')


const getWinTitle = (identifierType, identifier) => {
	if (identifier == null) {
		return null
	}
	if (identifierType == null) {
		return identifier
	}
	return 'ahk_' + identifierType + ' ' + identifier
}


/**
 * @param {function} calledFn - wrapped fn
 * @returns {function(args: ...PrimitiveInputValue|NullInputValue)} - takes variable number of args
 */
const primitiveParamFn = (calledFn) => (...args) => {
	return calledFn.apply(null,
		args.map(arg => arg instanceof NullInputValue
						? null
						: arg.readPrimitive()))
}

/**
 * @param {function} calledFn
 * @returns {function(PrimitiveInputValue, PrimitiveInputValue): AhkNode}
 */
module.exports = calledFn => primitiveParamFn((identifierType, identifier) => {
	return calledFn([getWinTitle(identifierType, identifier)])
})