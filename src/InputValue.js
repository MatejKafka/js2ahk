class InputValue {
	static get types() {
		return {
			primitive: 'primitive',
			arr: 'array',
			fn: 'fn',
		}
	}

	constructor(type, value) {
		if (!(Object.values(InputValue.types).includes(type))) {
			throw new Error('Invalid InputValue type: ' + type)
		}
		this.type = type
		this.value = value
	}

	_throwTypeError(attemptedType) {
		throw new TypeError('Cannot read "' + attemptedType + '" on InputValue of type ' + this.type)
	}

	readPrimitive() {this._throwTypeError(InputValue.types.primitive)}
	readArray() {this._throwTypeError(InputValue.types.arr)}
	readEvaluatedFn() {this._throwTypeError(InputValue.types.fn)
	}

}

class PrimitiveInputValue extends InputValue {
	constructor(value) {
		super(InputValue.types.primitive, value)
	}
	readPrimitive() {return this.value}
}

class ArrayInputValue extends InputValue {
	constructor(value) {
		super(InputValue.types.arr, value)
	}

	/** @returns {[*]}
	 */
	readArray() {return this.value}
}

class FnInputValue extends InputValue {
	/**
	 * @param {[AhkNode]} value
	 */
	constructor(value) {
		super(InputValue.types.fn, value)
	}

	/** @returns {[AhkNode]}
	 */
	readEvaluatedFn() {return this.value}
}


module.exports = {
	InputValue: InputValue,
	PrimitiveInputValue: PrimitiveInputValue,
	ArrayInputValue: ArrayInputValue,
	FnInputValue: FnInputValue
}