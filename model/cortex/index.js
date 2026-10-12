import { SimpleDie } from "#model/dice.js"
import { defaultCompare, filterIndexByBestValue } from "#model/compare.js"
/**
 * Dice mechanics for cortex prime.
 * @module model/cortex
 */
/**
 * @template {Error} [TError=RangeError]
 * @typedef IndexOptions
 * @property {TError} [error] - the error thrown on failure.
 * @property {number} length - the exclusive maximum index.
 * @param {boolean} [allowNegative] - does the negative indexes map from end of array.
 * @property {number} [minIndex] - the inclusive minimal index.
 * @property {number} [maxIndex] - the inclusive maximal index.
 * @property {boolean} [evaluate] - is non-numeric values converted to integer numbers? If true, String is parsed and other values are converted numbers.
 * @property {boolean} [truncate] - is non-integer numbers truncated to numbers.
 */
/**
 * @template {Error} [TError=RangeError]
 * @param {number} index - the tested index.
 * @param {IndexOptions<TError>} options - the index options.
 * @returns {number} - a valid index.
 * @throws {TError} - the check failed.
 */
export function checkIndex(index, options) {
 if (typeof index !== "number") {
  if (options.evaluate) {
   try {
    if (typeof index === "string") {
     index = Number(index)
     if (Number.isNaN(index)) {
      throw "Invalid string";
     }
    } else {
     index = +index;
    }
   } catch (err) {
    throw options.error ?? new RangeError("Non-integer index")
   }
  }
 }
 if (!Number.isSafeInteger(index)) {
  if (!Number.isFinite(index)) {
   throw options.error ?? new RangeError("Non-integer index")
  } 
  if (options.truncate) {
   try {
    index = Math.trunc(index)
   } catch(err) {
    throw options.error ?? new RangeError("Non-integer index")
   }
  }
  if (!Number.isSafeInteger(index)) {
   throw options.error ?? new RangeError("Non-integer index")
  }
 }
 if (index < 0 && options.allowNegative) {
   index += options.length;
  } 
  if (index < 0 || options.minIndex && index < options.minIndex) {
   throw options.error ?? new RangeError("Index too small")
  }
 
 if (index >= options.length || options.maxIndex && index > options.maxIndex) {
  throw options.error ?? new RangeError("Index too large")
 }
 return index;
}

/**
 * A value can be used like a number.
 * @typedef {{valueOf(): number;}} NumberLike
 */

/**
 * A cortex die result contains the die,the die result, and whether the die selected or not.
 * @template {string} [TStatus="effect"] - the status classes.
 * @typedef {readonly [CortexDie, number|NumberLike, (boolean|TStatus)?]} CortexDieResult
 */
/**
 *  @template {string} [TStatus="effect"] - the status classes.
 * @overload
 * @param {CortexRollResult<TStatus>} source
 * @return {CortexDieResult} A copy of the result.
 */
 
/**
 * @template {string} [TStatus="effect"] - the status classes.
 * @overload
 * @param {CortexDie} die - the rolled die
 * @param {number} rolled - the rolled value.
 * @param {boolean|TStatus} [status = false] - the status of the rolled die.
 * @returns {CortexDieResult<TStatus>} - the created result.
 */
export function CortexDieResult(
 die, rolled = undefined, status = false
) {
 if (rolled === undefined) {
  return [...rolled]
 } else {
  return [die, rolled, status]
 }
}

/**
 * Cortex roll result gives a view of rolled values.
 *  @template {string} [TStatus="effect"] - the status classes.
 */
export class CortexRollResult {
 /**
  * The rolled results.
  * @type {CortexDieResult<TStatus>[]}
  */
 #rolled;
 /**
  * @param {Iterable<CortexDieResult<TStatus>} [rollResults] - the roll results
  */
 constructor(rollResults = []) {
  this.#rolled = [...rollResults]
 }
 /**
  * Test result is an effect die result.
  * @param {CortexDieResult<TStatus>} result
  * @returns {boolean} Whether the result is an effect die.
  */
 isEffectResult(result) {
  return result[2] === "effect"
 }
  /**
  * Test result is a selected die result.
  * @param {CortexDieResult<TStatus>} result
  * @returns {boolean} Whether the result is a selected die.
  */
 isSelectedResult(result) {
  return result[2] === true;
 }
  /**
  * Test result is a hitch die result.
  * @param {CortexDieResult<TStatus>} result
  * @returns {boolean} Whether the result is a hitch die.
  */
 isHitchResult(result) {
  return result[1] === 1;
 }
  /**
  * Test result is an available die result.
  * @param {CortexDieResult<TStatus>} result
  * @returns {boolean} Whether the result is an available die.
  */
 isAvailableResult(result) {
  return !(this.isHitchResult(result) || this.isEffectResult(result) || this.isSelectedResult(result))
 }
 
 /**
  * The maximum number of selected dice.
  */
 get maxSelected() {
  return 2;
 }
 
 /**
  * The effect dice of the roll.
  * @type {ReadonlyArray<CortexDieResult<TStatus>>}
  */
 get effect() {
  return this.#rolled.filter(
   this.isEffectResult.bind(this)
  )
 }
 /**
  * The currently selected dice.
  */
 get selected() {
  return this.#rolled.filter(
   (this.isSelectedResult.bind(this))
  )
 }
 /**
  * The hitches not available by default.
  */
 get hitches() {
  return this.#rolled.filter(
   (this.isHitchResult.bind(this))
  )
 }
 /**
  * The available die results.
  */
 get available() {
  return this.#rolled.filter(
   (this.isAvailableResult.bind(this))
  )
 }
 /**
  * Is the implementation strict.
  * Strict implementation throws errors on invalid inpits.
  */
 get strict() {
  return false;
 }
 /**
  * The total of the current result.
  */
 get result() {
  return this.selected.reduce(
   (acc, value, index) => {
    return acc + value[1]
   },
   0
  )
 }
 /**
  * Create new result of a same kind with entries.
  * @param {Iterable<CortexDieResult<TStatus>>} entries - the iterator entries.
  * @returns {ThisType} - the new result with given entries.
  */
 create(entries) {
  return new this.constructor(entries);
 }
 
 /**
  * Unselect a selected die.
  * @param {number} selectedIndex - the unselected die index.
  * @returns {ThisType} - the current result with selected die moved to unselected.
  * @throws {RangeError} - the index was invalid.
  */
 unselect(selectedIndex) {
  const index = checkIndex(selectedIndex, {
   allowNegative: !this.strict,
   length: this.selected.length,
   error: new RangeError("Invalid selected index")
  })
  
  const entries = this.#rolled.reduce(
   (acc, rolled, index) => {
    if (rolled[2] === true) {
     if (selectedIndex === acc.selectedIndex) {
      acc.result.push(
       [rolled[0], rolled[1], false]
      )
     } else {
      acc.result.push(rolled)
     }
     acc.selectedIndex++;
    } else {
     acc.result.push(rolled)
    }
    return acc;
   },
   {
    result: [],
    selectedIndex: 0
   }
  ).result;
  return this.create(entries)
 }
 
 /**
  * Create a new result from current by selecting unselected die results.
  * @param {ReadonlyArray<number>} selectedIndexes - the indexes of the newly selected results.
  * @param [log] - logger used to report choices.
  * @returns {ThisType} - a new roll result created from current result by moving elements with listed index to selected results.
  * @throws {SyntaxError} - the selected indexes contained duplicate value.
  * @throws {RangeError} - the selected index contained an invalid index.
  */
 select(selectedIndexes=undefined, log=undefined) {
  const strict = this.strict;
  const selected = this.selected;
  if (selectedIndexes) {
   const indexes = selectedIndexes.reduce(
    (acc, selectedIndex, index) => {
     if (acc.includes(selectedIndex)) {
      if (strict) {
       throw new SyntaxError("Selecting same die twice")
      }
      return acc;
     }
     if (selectedIndex < 0) {
      if (strict) {
       throw new RangeError("Selected index too small: " + selectedIndex)
      } else if (selectedIndex < -selected.length) {
       log?.debug("Ignoring too small index " + selectedIndex)
       return acc;
      } else {
       log?.debug("Mapping negative index " + selectedIndex + " to " + (selectedIndex + selected.length));
       selectedIndex += selected.length;
      }
     }
     if (selectedIndex >= selected.length) {
      if (this.strict) {
       throw new RangeError("Index is too large " + selectedIndex)
      } else {
       log?.debug("Ignoring invalid index " + selectedIndex)
      }
      return acc;
     } else {
      acc.push(selectedIndex);
      return acc;
     }
    },
    []
   )
  } else {
   // Select as many possible until select count number are selected.
   const newSelected = this.maxSelected - selected.length
   if (newSelected > 0) {
   const indexes = filterIndexByBestValue(this.available, newSelected, (a,b) => defaultCompare(values[a], values[b]))
   }
   return this.create(
    this.#rolled.reduce( (acc, result, index) => {
     
     if (result[2] === false) {
      if (indexes.includes(acc.unselectedIndex)) {
      acc.result.push([result[0], result[1], true])
      } else {
       acc.result.push(result)
      }
      acc.unselectedIndex++;
     } else {
      acc.result.push(result);
     }
    },
     {
      result: [],
      unselectedIndex: 0
     }
    ).result);
  }
 }
 
 /**
  * Is result valid.
  * @type {boolean}
  */
 get isValid() {
  return this.selected.length <= this.maxSelected;
 }
}

/**
 * Solething appearing like a cortex die.
 * @typedef CortexDiceLike
 * @property {string} [title]
 * @property {() => number|NumberLike} roll
 */



/**
 * A simple die.
 * @implements CortexDiceLike
 */
export class CortexDie extends SimpleDie {
 /**
  * The cortex dice in increasing order of magnitude.
  */
 static DICE = Object.freeze([4, 6, 8, 10, 12].map(sideCount => new CortexDie(sideCount)));
 static get D4() {
  return CortexDie.DICE[0]
 }
 static get D6() {
 return CortexDie.DICE[1]
}
static get D8() {
 return CortexDie.DICE[2]
}
static get D10() {
 return CortexDie.DICE[3]
}
static get D12() {
  return CortexDie.DICE[4]
 }
 /**
  * @param {number} sideCount - the number of sided for the die.
  */
 constructor(sideCount) {
  super(sideCount)
 }
 
 /**
  * Compare die sides.
  * @param {CortexDie} another
  * @return {ComparisonResult}
  */
 compareTo(another) {
  if (another instanceof CortexDie) {
   return defaultCompare(this.sides.length, another.sides.length)
  }
 }
}

/**
 * A cortex dice pool.
 */
export class CortexPool {
 /**
  * The dice of the pool.
  * @type {CortexDie[]}
  */
 #dice;
 
 /**
  * Create an empty dice pool.
  * @overload
  */
 /**
  * Create a new cortex dice pool.
  * @overload
  * @param {Iterable<CortexDie>} dice - the dice of the pool.
  */
 constructor(dice) {
  this.#dice = [...dice ?? []]
 }
 
 /**
  * Roll the pool.
  * @return {CortexRollResult}
  */
 roll() {
  return new CortexRollResult(this.#dice.map(die => CortexRollResult(die, die.roll())));
 }
}

export class Resource {
 constructor(die, count=1) {
  
 }
 roll() {
  const rolled = [];
  let max = 0;
  for (let i=0; i < count; i++) {
   const roll = die.roll()
   rolled.push(roll)
   if (roll > max) {
    max = roll;
   }
  }
  return {
   rolled() {
    return rolled;
   },
   valueOf() {
    return max;
   },
   toString() {
    return `${this.valueOf()}[${this.rolled.join(",")}]`
   }
  }
 }
}

export class ResourcesPool {
 
 #members;
 
 /**
  * @param {Iterable<Resource>}
  */
 constructor(members) {
  this.#members = [...members]
 }
 create(members) {
  return new ResourcesPool(members)
 }
 
 append(...resource) {
  return this.create([...this.#members, ...resources])
 }
 remove(count) {
  if (count === 0) {
   return this.create(this.#members)
  }
  if (count >= this.#members.length) {
   return this.create([])
  } if (count <= 0) {
   return this.create(this.#members)
  } else if (count > 0) {
   return this.create(this.#members.slice(0,this.#members.length - count))
  }
 }
 
 roll() {
  const results = this.members.map( resource => [die, resource.roll()] );
  return new CortexRollResult(results)
  if (results.available.length) {
   // The result is among available.
  } else {
   return 
  }
 }
}

/**
 * Difficulty pool is a Cortex Pool with two dice of the same size.
 */
export class DifficultyPool extends CortexPool {
 
 static VERY_EASY= new DifficultyPool(CortexDie.DICE[0])
 static EASY= new DifficultyPool(CortexDie.DICE[1])
 static CHALLENGE = new DifficultyPool(CortexDie.DICE[2])
 static HARD= new DifficultyPool(CortexDie.DICE[3])
 static VERY_HARD = new DifficultyPool(CortexDie.DICE[4])
 /**
  * The difficulty pool.
  * @param {CortexDie} difficulty
  */
 constructor(difficulty) {
  super([difficulty, difficulty])
 }
}

export class BasicCortexPool extends CortexPool {
 
 #primaryCount;
 #opportunities;
 #resources;
 
 constructor(
  primaries,
  resources=[],
 opportunities=[]
 ) {
  super(primaries);
  this.#primaryCount = primaries.length;
  this.#opportunities = new CortexPool(opportunities);
  this.#resources = new ResourcesPool(resources);
 }
 
 get opportunities() {
  return this.#opportunities;
 }
 
 get resources() {
  
 }
 
 roll() {
  const primary = super.roll();
  const opportunity = this.opportunities.roll();
  const resources = this.resources.roll()
  
 }
}

export function Roll() {
 
}