
/**
 * @typedef {ReadonlyArray<string>} TargetPath
 */

/**
 * @template [T=any]
 * @callback ArrayPredicate
 * @param {T} element
 * @param {number} index
 * @param {ReadonlyArray<T>} array
 * @returns {boolean} Whether the element at index passes the filter.
 */

/**
 * Create path segment validator.
 * @param {PathOptions} [options]
 * @returns {ArrayPredicate<any>} The predicate the segment array must pass.
 */
export function getPathSegmentValidator(options = undefined) {
  const currentNodeRef = options?.currentNode ?? /^[.]$/u
  const parentNodeRef = options?.parentNode ?? /^[.]{2}$/u;
  const childNodeRef = options?.childNode ?? /^\p{L}+$/u
  if (options?.canonical) {
    // Cannonical does not have intermediate references and current node ref can only exist at start.
    return (segment, index, segments) => {
      if (typeof segment !== "string") return false;
      if (index) {
        // Childnode
        if (options?.relative) {
          if (parentNodeRef.test(segments[index - 1])) {
            return [childNodeRef, parentNodeRef].some(
              re => re.test(segment)
            )
          }
        }
        
        return childNodeRef.test(segment)
        
      } else {
        // Rootnode
        return (options?.relative ? [currentNodeRef, parentNodeRef, childNodeRef] :
          [currentNodeRef, childNodeRef]).some(
          re => re.test(segment)
        )
      }
    }
  } else if (options?.relative) {
    return (segment, index, segments) => {
      if (typeof segment !== "string") return false;
      return [currentNodeRef, parentNodeRef, childNodeRef].some(
        re => re.test(segment)
      )
    }
  } else {
    return (segment, index, segments) => {
      if (typeof segment !== "string") return false;
      return (index ? [childNodeRef] : [currentNodeRef, childNodeRef]).some(
        re => re.test(segment)
      )
    }
  }
}

/**
 * The current segment path
 * @returns {RegExp} The regular expression matching a valid current path segment.
 */
function TargetPathCurrentNode() { return /^$/u; }

/**
 * @typedef {PathOptions} TargetPathOptions
 * @property {boolean} [relative=false]
 * @property {boolean} [canonical=true]
 * @property {RegExp} [currentNode=TargetPathCurrentNode]
 */

/**
 * @param {unknown} tested - the tested value.
 * @param {TargetPathOptions} [opt] - the target path options.
 * @returns {tested is TargetPath}
 */
export function isTargetPath(tested, opt = undefined) {
  return (Array.isArray(tested) && tested.every(getPathSegmentValidator({relative: false, canonical: true, currentNode: TargetPathCurrentNode(), ...(opt??{})} )))
}
/**
 * @overload
 * @param {string} parent
 * @param {string} [child]
 * @returns {TargetPath}
 * @throws {TypeError} - the parent path is invalid.
 * @throws {SyntaxError} - the child path is invalid.
 */
/**
 * @overload
 * @param {TargetPath} parent
 * @param {string} [child]
 * @returns {TargetPath}
 */
export function resolveTargetPath(parent, child = undefined) {
  const source = Array.isArray(parent) ? parent : parent.split(".")
  if (!isTargetPath(source, {canonical:true})) {
    throw new TypeError("Invalid parent path")
  }
  if (child) {
    const segments = child.split(".");
    if (!isTargetPath(segments)) {
      throw new SyntaxError("Invalid child path")
    } else if (segments.length && segments[0].length) {
      // Child is absolute
      return segments;
    } else {
      // Child is relative to current path.
      return [...source, ...(segments.slice(1))]
    }
    
  } else {
    return parent;
  }
  
}

/**
 * Is a path an absolute target path.
 * @param {unknown} tested
 * @param {TargetPathOptions} [options] - the target path options.
 * @returns {tested is TargetPath} The tested is an absolute target path.
 */
export function isAbsolutePath(tested, opt ={}) {
  return isTargetPath(tested) && (tested.length === 0 || tested[0].length > 0);
}