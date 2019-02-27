const {PrimitiveInputValue} = require('../../InputValue')
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
 * @returns {function(...[PrimitiveInputValue]): *}
 */
const primitiveParamFn = (calledFn) => (...args) => {
	return calledFn.apply(null, args.map(arg => arg.readPrimitive()))
}

/**
 * @param {function} calledFn
 * @returns {function(PrimitiveInputValue, PrimitiveInputValue): AhkNode}
 */
module.exports = calledFn => primitiveParamFn((identifierType, identifier) => {
	return calledFn([getWinTitle(identifierType, identifier)])
})