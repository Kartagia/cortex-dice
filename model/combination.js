
/**
 * @module model/combination
 */
 
 /**
  * @template Side
  * A combination.
  */
 export class Combination {
   #combination;
   
   /**
    * @param {Iterable<Side>} init
    */
   constructor(init=[]) {
     this.#combination = [...init]
   }
   
   get size() {
     return this.#combination.length;
   }
   get at(index) {
     return this.#combination[index];
   }
   /**
    * @param {Combination<Side>} other The combination appended at the end of the current combination.
    * @returns {Combination<Side>}
    */
   append(other) {
     return new Combination([...this, ...other])
   }
   /**
    * Create combinations by creating combinations caused by the die addition to the roll.
    * @param {module:model/dice.DiceModel<Side>} die
    * @returns {Combinations<Side>} The combinations created by appending each die side to the combination.
    */
   addRoll(die) {
     return new Combinations(
       this.die.sides.map(
         value => new Combination([...this.#combination, value])
       )
     )
   }
   
   toString() {
     return `[${this.#combination.map(
       value => String(value)
     ).join(",")}]`
   }
   [Symbol.iterator]() {
     return this.#combination[Symbol.iterator]()
   }
   every(
     predicate
   ) {
     return this.#combination.every(predicate)
   }
   some(
  predicate
) {
  return this.#combination.some(predicate)
}
 }
 
 /**
  * Combination options.
  * @template Side
  * @typedef {object} CombinationOptions
  * @property {(a: Combination<Side>, b: Combination<Side>) => boolean} [equal] The equality of the combinations.
  * @property {boolean} [unordered] Does the combinations treat permitations as equal combinations.
  */
/**
 * @template Side
 * @param {Combination<Side>} a
 * @param {Combination<Side>} b
 * @returns {boolean} The a and b are equivalent combinations.
 */
 export function equalCombination(a,b) {
   if (a.length !== b.length) return false;
   return a.every( 
     (value, index) => Object.is(value, b.at(index))
   )
 }
 
 /**
 * @template Side
 * @param {Combination<Side>} a
 * @param {Combination<Side>} b
 * @returns {boolean} The a and b are equivalent permutations.
 */
 export function equalPermutation(a,b) {
   if (a.length !== b.length) return false;
   const bIndice = a.reduce(
     (acc, value, index, values) => {
       // If value was skipped, no further testing is needed
       if (values.length !== acc.length + index) return acc;
       const bIndex = acc.findIndex(
         (bI) => Object.is(value,b[bI])
       );
       if (bIndex < 0) {
         // Nothing to remove
         return acc;
       } else {
         // Remove found index
         return acc.toSpliced(bIndex, 1);
       }
     },
     [...b].map(
       (_, i) => i
     )
   )
   return bIndice.length === 0;
 }
 /**
  * A combinations group combinations with same result.
  * @template Side The values of the combinations.
  * @template {Options extends CombinationOptions<Side>} [Options = CombinationOptions<Side>]
  */
 export class Combinations {
   /**
    * @type {[Combination<Side>, number][]}
    */
   #combinations = new Map([])
   
   /**
    * Create a combinations with given options.
    * @override 
    * @param {Iterable<Combination<Side>|[Combination<Side>, number]>} init The initial combinations 
    * @param {Options} options The options of the combinations.
    */
   /**
    * Create a combinations with default equality.
    * @override
    * @param {Iterable<Combination<Side>|[Combi nation<Side>,number]>} init The initial combinations 
    */
   constructor(init, options={}) {
     const equal = options.equal ?? (options.unordered ? equalPermutation : equalCombination )
     this.#options = Object.freeze({
       ...options,
       equal
     })
     for (const member of init) {
       const key = Array.isArray(member) ? member[0] : member;
       const addedCount = Array.isArray(member) ? member[1] : 1;
       const index = this.#combinations.findIndex(
         ([combo, count]) => this.#options.equal(combo, key)
       );
       if (index < 0) {
         this.#combinations = this.#combinations.append([key, addedCount])
       } else {
         this.#combinations = this.#combinations.toSpliced(index, 1, [key, this.#combinations[index][1] + addedCount])
       }
     }
   }
   
   #options;
   
   /**
    * The combination options.
    * - The combinations always has equality function.
    * @type {Required<Pick<Options, "equal">> & Omit<Options, "equal">}
    */
   get options() {
     return this.#options;
   }
   
   /**
    * @param {Combination<Side>} combination The combination, whose count is queried.
    * @returns {number} The number of equivalent combinations in the combinations.
    */
   count(combination) {
     return this.#combinations.reduce(
       (acc, member) => this.#options.equal(member[0], combination) ? member[1] + acc : acc,
       0
     )
   }
   
   /**
    * The total nunber of combinations.
    */
   get total() {
     return this.#combinations.reduce(
       (acc, entry) => acc + entry[1]
       ,0
     )
   }
   /**
    * The number of the distinct combinations.
    */
   get size() {
     return this.#combinations.length;
   }
   [Symbol.iterator]() {
     let iter = this.#combinations[Symbol.iterator]();
     return {
       next() {
         const cursor = iter.next();
         if (cursor.done) {
           return cursor;
         } else {
           return {
             value: [...cursor.value]
           }
         }
       },
       return() {
         return iter?.return() ?? {done: true, value: undefined};
       },
       throw(e) {
         return iter.throw(e);
       }
     }
   }
 }