import { createSides } from "#model/dice.js";
import {parseInt} from "#model/parse.js"
/**
 * @module model/dieCode
 */
/**
 * @template Value
 * @callback ValuePredicate
 * @param {Value} tested The tested value
 * @returns {boolean} True, iff the tested value passes the predicate.
 */
/**
 * The comparison operators.
 * @typedef {"="|"<>"|">"|"<"|"<="|">="} CompareOp
 */
/**
 * The comparison result.
 * - -1, if compared is less than comparee.
 * - 0, if compared is equal to comparee.
 * - +1, if compared is greater than comparee.
 * @typedef {-1|0|1} ComparisonResult
 */
/**
 * Compare values.
 * @template Value
 * @callback CompareFn
 * @param {Value} compared The compared value.
 * @param {Value} comparee The value compared to.
 * @returns {ComparisonResult} The comparison result for compared compared to comparee.
 * @throws {SyntaxError} The values are not comparable.
 */

/**
 * Comparison of integers
 * @type {CompareFn<number>}
 */
export function intCompare(compared, comparee) {
  if (Number.isSafeInteger(compared) && Number.isSafeInteger(comparee)) {
    return compared > comparee ? 1 : compared < comparee ? -1 : 0
  } else {
    throw new SyntaxError("Cannot compare non-integers")
  }
}


/**
 * @template Value
 * @param {CompareFn<Value>} compare The comparison function.
 * @param {Value} threshold The threshold value.
 * @param {CompareOp} op The comparison operator 
 * @returns {ValuePredicate<Value>} The value predicate returning true, if and only if the value passes the operator with the threshold.
 */
export function limitPredicate(compare, threshold, op) {
  switch (op) {
    case "<>":
      return (a) => {
        try {
          return compare(a, threshold) !== 0;
        } catch (err) { return false; }
      }
    case "=":
      return (a) => {
        try {
          return compare(a, threshold) === 0;
        } catch (err) { return false; }
      }
    case "<":
      return (a) => {
        try {
          return compare(a, threshold) < 0;
        } catch (err) { return false; }
      }
    case "<=":
      return (a) => {
        try {
          return compare(a, threshold) <= 0;
        } catch (err) { return false; }
      }
    case ">":
      return (a) => {
        try {
          return compare(a, threshold) > 0;
        } catch (err) { return false; }
      }
    case ">=":
      return (a) => {
        try {
          return compare(a, threshold) >= 0;
        } catch (err) { return false; }
      }
    default:
      throw new SyntaxError("Invalid comparison operator " + JSON.stringify(op))
  }
}



/**
 * Limit parse options.
 * The limit parse options require comparison of the parsed values.
 * @template Value
 * @typedef {module:model/parse.ParseOptions<Value> & {compare: CompareFn<Value>;} } LimitParseOptions
 */

/**
 * @template Value The limited value.
 */
export class Limit {
  
  /**
   * @template Value
   * @param {string} source The string representation of the limit.
   * @param {LimitParseOptions<Value>} options The limit parse options.
   * @returns {Limit<Value>} The limit parsed from the string.
   * @throws {SyntaxError} The source did not contain valid limit.
   */
  static parse(source, options) {
    let op = ""
    if (source.startsWith("<")) {
      if (op.startsWith("<>")) {
        op = "<>"
      } else if (op.startsWith("<=")) {
        op = "<="
      } else {
        op = "<"
      }
    } else if (source.startsWith(">")) {
      op = source.startsWith(">=") ? ">=" : ">"
    } else if (source.startsWith("=")) {
      op = "="
    }
    if (op) {
      return new Limit(options.compare, options.parse(source.substring(op.length)), op)
    }
    throw new SyntaxError("Invalid limit operator")
  }
  
  /**
   * @param {CompareFn<Value>} compare The comparison of the values.
   * @param {Value} threshold The threshold value.
   * @param {CompareOp} [operator=">="] The comparison operator.
   */
  constructor(
    compare,
    threshold,
    operator = ">="
  ) {
    this.compare = compare;
    this.threshold = threshold;
    this.operator = operator;
    this.test = limitPredicate(compare, threshold, operator)
  }
  compare;
  threshold;
  operator;
  /**
   * Test the limit.
   * @type {ValuePredicate<Value>}
   */
  test;
}

/**
 * @template Side The die side type.
 */
export class DieCode {
  /**
   * Get a regular expression matching a die code.
   * @returns {RegExp} The regular expression matching to a dice code.
   * @note Reserved groups:
   * - count: The number of dice. Optional.
   * - sides: Either a side count or list of comma separated sides between square brackets
   * - keep: The number of kept dice. Optional.
   * - drop: The number of dropped
   * dice. Optional.
   * - success: The success limit. Optional.
   * - crit: The critical success limit. Optional.
   * - botch: The botch limit. Optional.
   */
  static dieCodeRegExp() {
    return /^(?<count>\d+)?[dD](?<sides>\d+|\[(?:[+-]?\d+)(?:,\s*(?:[+-]?\d+))*\])(?:[kK](?<keep>\d+))?(?:[dD](?<drop>\d+))?(?:TN(?<success>(?:<=?|=|<>|>=?)?(?:[+-]?\d+))(?:[cC](?<crit>(?:<=?|=|<>|>=?)?[+-]?\d+))?(?:[bB](?<botch>(?:<=?|=|<>|>=?)?[+-]?\d+))?)?$/;
  }
  
  /**
   * Parse a die code with simple dice.
   * @param {string} code The parsed code.
   * @returns {DieCode<number>}
   * @throws {SyntaxError} The code is invalid.
   */
  static parseSimpleDie(code) {
    
    const parser = parseInt;
    const compare = intCompare;
    const match = DieCode.dieCodeRegExp().exec(code)
    if (match) {
      const groups = match.groups;
      if (!groups) throw new Error("RegEx Groups not supported!")
      const count = parseInt(groups.count ?? "1");
      const sides = [];
      if (groups.sides?.startsWith("[")) {
        sides.push(...(
          groups.sides.substring(1, groups.sides.length - 1).split(new RegExp(",\\s*", "g"))
          .map(parser)
        ))
      } else {
        const sideCount = parseInt(groups.sides);
        sides.push(...createSides({ sideCount }))
      }
      const keep = (groups.keep) ? parseInt(groups.keep) : undefined;
      const drop = (groups.drop) ? parseInt(groups.drop) : undefined;
      const success = groups.success ? Limit.parse(groups.success, {parse: parser, compare}): undefined;
      const crit = groups.crit ? Limit.parse(groups.crit, {parse: parser, compare}) : undefined;
      const botch = groups.botch ? Limit.parse(groups.botch, {parse: parser, compare}) : undefined;
      return new DieCode(
      {
        count,
        sides,
        keep,
        drop,
        success,
        crit,
        botch
      }, compare)
    } else {
      throw new SyntaxError("Invalid die code")
    }
  }
  
  /**
   * @template Side
   * @typedef {object} DieCodeInit
   * @property {number} [count=1] The number of dice thrown.
   * @property {Iterable<Side>} sides The die sides.
   * @property {number} [keep] The number of kept dice.
   * @property {number} [drop=0] The number of dropped dice.
   * @property {Limit<Side>} [success] The limit of success.
   * @property {Limit<Side>} [crit] The limit of a critical success.
   * @property {Limit<Side>} [botch] The limit of a die value adding botch count.
   */
  
  /**
   * @param {DieCodeInit<Side>} param0,
   * @param {CompareFn<Side>} compare
   */
  constructor({
    count = 1,
    sides,
    keep = Number.POSITIVE_INFINITY,
    drop = 0,
    success = undefined,
    crit = undefined,
    botch = undefined,
  }, compare) {
    this.count = count;
    this.sides = sides;
    this.compare = compare;
    this.success = success
    this.botch = botch;
    this.crit = crit;
    this.keep = keep;
    this.drop = drop;
  }
}