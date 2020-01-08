class InputValue {
	constructor(value) {
		this.value = value
	}

	_throwTypeError(attemptedType) {
		// FIXME: this error message is strongly dependent on context of the project
		const err = new TypeError(`Attempted to call function with argument of type ${this.constructor.name},`
							+ ` but ${attemptedType.name} is expected`)
	
		const lines = err.stack.split('\n')
		err.stack = lines[0] + '\n'
			+ lines.slice(3) // FIXME: fragile
				.filter(l => !l.includes("constructAhkProxy.js"))
				.join('\n')

		// const srcLine = lines[3]
		// console.error(srcLine.slice(srcLine.lastIndexOf('(') + 1, -1))
		
		// type error should be a fatal uncatchable error
		console.error(err)
		process.exit(1)
	}

	readPrimitive() {this._throwTypeError(PrimitiveInputValue)}
	readArray() {this._throwTypeError(ArrayInputValue)}
	readEvaluatedFn() {this._throwTypeError(FnInputValue)}
	readObject() {this._throwTypeError(ObjectInputValue)}
	readNull() {this._throwTypeError(NullInputValue)}
}

class PrimitiveInputValue extends InputValue {
	constructor(value) {
		super(value)
	}
	readPrimitive() {return this.value}
}

class ArrayInputValue extends InputValue {
	constructor(value) {
		super(value)
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
		super(value)
	}

	/** @returns {[AhkNode]}
	 */
	readEvaluatedFn() {return this.value}
}

class NullInputValue extends InputValue {
	constructor(value) {
		super(value)
	}
	
	readNull() {return this.value}
}

class ObjectInputValue extends InputValue {
	constructor(value) {
		for (let [key, value] of Object.entries(this.value)) {
			if (!(value instanceof InputValue)) {
				throw new Error("All properties of ObjectInputValue must be instances of InputType"
					+ " (key: " + key + ", value: " + value + ")")
			}
		}
		
		super(value)
		
		this.value = new Proxy(this.value, {
			get: (obj, prop) => {
				if (!obj.hasOwnProperty(prop)) {
					throw new TypeError("Cannot access undeclared property `" + prop + "` on object")
				}
				return obj.prop
			}
		})
	}

	readObject() {return this.value}
}


/**
 * @param {*} value
 * @param {function(function): AhkNode[]} expandFn_fn - may be null if the value is not a function
 * @returns {InputValue}
 */
const wrapInputValue = (value, expandFn_fn) => {
	if (value == null) return new NullInputValue(value)
	if (value instanceof Function) return new FnInputValue(expandFn_fn(value))	
	if (Array.isArray(value)) return new ArrayInputValue(value)
	
	if (typeof value == 'object') {
		const out = {}
		for (let [key, val] of Object.entries(value)) {
			out[key] = wrapInputValue(val, expandFn_fn)
		}
		return new ObjectInputValue(out)
	}

	return new PrimitiveInputValue(value)
}


module.exports = {
	InputValue: InputValue,
	PrimitiveInputValue: PrimitiveInputValue,
	ArrayInputValue: ArrayInputValue,
	FnInputValue: FnInputValue,
	NullInputValue: NullInputValue,
	ObjectInputValue: ObjectInputValue,
	
	wrapInputValue: wrapInputValue
}