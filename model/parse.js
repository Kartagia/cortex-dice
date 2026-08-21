
/**
 * The parse module provides declaration
 * for parser function, parsing position, and parse error.
 * @module model/parse
 */
 /**
 * The parse function parses a value from string.
 * @template Value
 * @callback ParseFn
 * @param {string} source The parsed string.
 * @returns {Value} The parsed balue.
 * @throws {SyntaxError} The parse failed.
 */

/**
 * @template Index
 * @typedef {object} ParseStartPosition
 * @property {Index} current The current parse position.
 */
/**
 * A parse position after failed parse.
 * @template Index
 * @typedef {object} ParseErrorPosition
 * @property {Index} current The parse start position.
 * @property {Index} error The parse error position.
 */
/**
 * A position after successful parse.
 * @template Index
 * @typedef {object} ParseResultPosition
 * @property {Index} current The current parse position after successful parse.
 * @property {Index} parseStart The starting position of the parse.
 */
/**
 * @typedef Index The index type.
 * @typedef {ParseStartPosition<Index>|ParseErrorPosition<Index>|ParseResultPosition<Index>} ParsePosition
 */
/**
 * A parse error represents a parse error.
 * @template Index The index type.
 */
export class ParseError extends SyntaxError {
 
 /**
  * The parse position pf the error.
  * @type {Readonly<ParseErrorPosition<Index>>}
  */
 #position;
 /**
  * Create a new parse error
  * @param {string} message The error message.
  * @param {ParseErrorPosition<Index>} position The parse position of the error.
  */
 constructor(message, position) {
  super(message)
  this.name = this.constructor.name;
  this.#position = Object.freeze({
   current: position.current,
   error: position.error
  })
 }
 
 /**
  * The parse error position.
  */
 get position() {
  return this.#position;
 }
 /**
  * The error index of the parse failure.
  */
 get errorIndex() {
  return this.position.error;
 }
 /**
  * The start index of the failed parse.
  */
 get startIndex() {
  return this.position.current;
 }
}
/**
 * Partial parse.
 * @template Value
 * @callback ParsePartFn
 * @param {string} source The parsed string.
 * @param {ParsePosition<number>} position Thr parse position. The value is updated.
 * @param {ParseOptions<Value, number>} [options] The parse options.
 * @returns {Value} The parsed value, if the parsevsucceeded.
 * @throws {ParseError<number>} The parse failed.
 */
/**
 * The parsing options.
 * @template Value
 * @typedef {object} ParseOptions
 * @property {ParseFn<Value>} parse The parsing function for the value.
 */
 
 export function ParseStartPosition(current) {
  return {
   current
  }
 }
 
 /**
  * Create a parse result from 
  * an error position, and the 
  * end position of a successful parse.
  * @template Index
  * @param {ParseErrorPosition<Index>} startPosition The starting position after an error.
  * @param {Index} current The current position of the parse after successful parse.
  * @returns {ParseResultPosition<Index>} The parse result position.
 /**
  * Create a parse result position from starting position, and the end of the parse position.
  * @override
  * @template Index
  * @param {ParseStartPosition<Index>|ParseResultPosition<Index>} startPosition The starting position.
  * @param {Index} current The parse end position (exclusive)
  * @returns {ParseResultPosition<Index>} The parse result position with starting position set from start position.
  */
 /**
  * The implementation of the parde result position.
  */
 export function ParseResultPosition(
  position, current) {
  return {
   parseStart: position.current,
   current
  }
 }
 
 /**
  * @template Index
  * @param {ParsePosition<Index>} position The parse start position.
  * @param {Index} error The error index.
  * @returns {ParseErrorPosition<Index>} The parse error position of a parse starting at position and failing at error.
  */
 export function ParseErrorPosition(
  position, error
 ) {
  return {
   current: position.current,
   error
  }
 }
 /**
  * Parse an integer value.
  * @type {ParseFn<number>}
  */
 export function parseInt(
  source
 ) {
  const result = Number.parseInt(source);
  if (Number.isSafeInteger(result)) {
   if (/^\s*[+-]?\d+\s*$/.test(source))
    return result;
  }
  throw new SyntaxError("Not a safe integer")
 }