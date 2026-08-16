
/**
 * The die results.
 * @module model/result
 */
 
/**
 * The result options.
 * @template Side
 * @typedef {object} ResultOptions
 * @property {(side: Side) => string } [caption] The stringification.
 */ 
 
/**
 * A roll result.
 * @template Side
 * @typedef {object} RollResult
 * @property {Side} value The result value.
 * @property {number} index The result index. A negative value
 * indicates the result has no index.
 * @property {() => number} valueOf The index of the result value.
 * @property {() => string} toString The result caption.
 */


 
 /**
  * A basic result.
  * @template Side
  * @extends {RollResult<Side>}
  */
export class DieResult {
  
  #index;
  
  #side;
  
  #options;
  
  /**
   * Create a basic result.
   * @param {Side} side The result side
   * @param {number} index The index of the resulting die.
   * @param {ResultOptions<Side>} [options] The result options.
   */
  constructor(
    side,
    index,
    options=undefined
  ) {
    this.#index = index;
    this.#side = side;
    this.#options = {caption: String, ...options ?? {}}
  }
  
  get value() {
    return this.#side;
  }
  
  get index() {
    return this.#index;
  }
  valueOf() {
    return this.index;
  }
  toString() {
    return this.options.caption(this.value)
  }
}