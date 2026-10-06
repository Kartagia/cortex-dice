/**
 * A comparison result.
 * @typedef {-1|0|1} ComparisonResult
 */

/**
 * Comparison of values.
 * @template TValue
 * @callback Comparison
 * @param {TValue} compared
 * @param {TValue} comparee
 * @returns {ComparisonResult}
 * @throws {SyntaxError}
 */

/**
 * Default comparison using loose equality.
 * @template TValue - the compared value type.
 * @type {Comparison<TValue>}
 */
export function defaultCompare(compared, comparee) {
 if (compared == comparee) return 0;
 if (compared < comparee) return -1;
 if (compared > comparee) return 1;
 throw new SyntaxError("Values are not comparable")
}


/** *
Get indexes of a number of best values using { @link defaultCompare }
 * @template T *
 @overload *
 @param { ReadonlyArray < T > } array - the source array.*@param { number } count - the number of best values selected.A negative number is interpreted as number of values not selected.*@return { Array < number > } - the selected indeces in ascending order of values *
 /
/**
 * Get indexes of a number of the best values using a comparison 
 * @template T
 * @overload
 * @param {ReadonlyArray<T>} array - the source array.
 * @param {number} count - the number of selected or absentee values.
 * @param {import("#model/compare.js").Comparison<T>} compare - the comparison function for comparing values.
 * return {Array<number>} - the selected indeces in ascending order of values 
 */
export function filterIndexByBestValue(array, count, compare = defaultCompare) {
 
 if (count < 0) {
  count += array.length
 }
 if (count >= 1) {
  return array.reduce(
   (acc, value, index, values) => {
    if (acc.length < count) {
     const insertIndex = acc.findIndex(c => compare(values[c], value) > 0)
     if (insertIndex < 0) {
      acc.push(index)
     } else {
      acc.splice(insertIndex, 0, index);
     }
     return acc;
    } else {
     const insertIndex = acc.findIndex(c => compare(values[c], value) > 0)
     if (insertIndex > 0) {
      acc.splice(insertIndex, 0, index);
      acc.unshift()
     } else if (inserIndex < 0) {
      acc.push(index)
      acc.unshift();
     }
     return acc;
    }
   },
   []
  )
 }
 return [];
}
/**
 * Get a number of best values using {@link defaultCompare}
 * @template T
 * @overload
 * @param {ReadonlyArray<T>} array - the source array.
 * @param {number} count - the number of best values selected. A negative number is interpreted as number of values not selected.
 * @return {Array<T>} - the selected indeces in ascending order of values 
 */
/**
 * Get a number of the best values using a comparison 
 * @template T
 * @overload
 * @param {ReadonlyArray<T>} array - the source array.
 * @param {number} count - the number of selected or absentee values.
 * @param {import("#model/compare.js").Comparison<T>} compare - the comparison function for comparing values.
 * @return {Array<T>} - the selected indeces in ascending order of values 
 */
export function filterByBestValue(array, count, compare = defaultCompare) {
 
 if (count < 0) {
  count += array.length
 }
 if (count >= 1) {
  return array.reduce(
   (acc, value, index, values) => {
    if (acc.length < count) {
     const insertIndex = acc.findIndex(c => compare(c, value) > 0)
     if (insertIndex < 0) {
      acc.push(value)
     } else {
      acc.splice(insertIndex, 0, value);
     }
     return acc;
    } else {
     const insertIndex = acc.findIndex(c => compare(c, value) > 0)
     if (insertIndex > 0) {
      acc.splice(insertIndex, 0, value);
      acc.unshift()
     } else if (inserIndex < 0) {
      acc.push(value)
      acc.unshift();
     }
     return acc;
    }
   },
   []
  )
 }
 return [];
}
