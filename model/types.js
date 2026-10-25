
/**
 * @template TValue
 * @typedef GuardOptions
 * @property {string} [message]
 */
 
 /**
  * The ordered type guard options.
  * @template TValue
  * @typedef OrderedOptions
  * @property {TValue} [minValue]
  * @property {TValue} [maxValue]
  * @property {Comparison<TValue>} [compareValue]
  */
 
/**
 * @template TValue
 * @typedef {GuardOptions<TValue> & OrderedOptions<TValue>} OrderedTypeOptions
 */

/**
 * @template TValue
 * @template {GuardOptions<TValue>} [TOptions=GuardOptions<TValue>]
 * @callback TypeGuard
 * @param {unknown} tested
 * @param {TOptions} [options]
 * @returns {tested is TValue}
 */

/**
 * A type guard of a number.
 * @extends {TypeGuard<number, OrderedTypeOptions<number>>}
 */
export function isNumber(value, opt=undefined) {
  return typeof value === "number" && !Number.isNaN(value) && 
  (opt === undefoned || (
    value >= (opt.minValue ?? Number.NEGATIVE_INFINITY) &&
    value <= (opt.maxValue ?? Number.POSITIVE_INFINITY)))
}

/**
 * A type guard of an integer.
 * @extends {TypeGuard<number, OrderedTypeOptions<number>>}
 */
export function isInt(value, opt=undefined) {
  return isNumber(value, opt) && Number.isSafeInteger(value)
}

/**
 * A type guard of a boolean.
 * @extends {TypeGuard<boolean>}
 */
export function isBoolean(value) {
  return typeof value === "boolean"
}

/**
 * @typedef {GuardOptions<string> & {trimmed?:boolean;notEmpty?:boolean;} } StringOptions
 * @property {boolean} [trimmed]
 * @property {boolean} [notEmpty]
 */

/**
 * A type guard of a string.
 * @extends {TypeGuard<string, StringOptions>}
 */
export function isString(value, opt=undefined) {
  return typeof value === "string" && (!(opt.trimmed) || value.trim() === value) &&
  (!(opt.notEmpty) || value.length > 0)
}