/**
 * @module model/dice
 */

/**
 * A simple side initialization.
 * @template [Side = number]
 * @typedef {object} SimpleSideInit
 * @property {number} sideCount The number of sides in the die.
 * @property {(index: number) => Side} [side] The function determining the side value.
 */
/**
 * A complex side initialization.
 * @template Side
 * @typedef {object} ComplexSideInit
 * @property {Side} first The first side.
 * @property {Side} last The last side.
 * @property {(side: Side) => Side} next The next side 
 */

/**
 * @override
 * @param {SimpleSideInit} props
 */
/**
 * @override
 * @template Side
 * @param {SimpleSideInit<Side>} props
 */
/**
 * @override
 * @template Side
 * @param {ComplexSideInit<Side>} props
 */
/**
 * @template [Side = number]
 * @param {ComplexSideInit<Side>|SimpleSideInit<Side>} props The side declaration.
 * @returns {GeneratorFunction<Side>} The iterator returning the due sides.
 */
export function* createSides(props) {
  if (props.sideCount) {
    const sideCount = Math.trunc(props.sideCount);
    if (!Number.isFinite(sideCount)) throw new SyntaxError("Invalid side count");
    let result = 0;
    const side = props.side ?? ((index) => index + 1);
    while (result < sideCount) yield side(result++);
    return;
  } else if ("first" in props) {
    let cursor = props.first;
    while (cursor !== props.last) {
      yield cursor;
      cursor = props.next(cursor)
    }
    yield cursor;
    return;
  }
  throw new SyntaxError("Invalid sides");
}

/**
 * A die model.
 * @template Side
 * @typedef {object} DieModel
 * @property {ReadonlyArray<Readonly<Side>>} sides
 * @property {string} title
 */

/**
 * @template Side The side value type.
 * @typedef {object} DieModelMethods
 * @property {(side: Side) => string} [sideCaption] The side caption defining function.
 */


/**
 * @template Side The side type.
 * @extends {DieModel<Side>}
 */
export class ComplexDie {
  #title;
  #sides;
  #sideCaption;
  /**
   * The complex die initializtion with itersble sides.
   * @typedef {ComplexDieInit<Side> & {sides: Iterable<Side>>} } ComplexDieInitWithIterableSides
   * @property {Iterable<Side>} sides The sides of the complex die.
   */
  
  /**
   * The complex die initializtion with itersble sides.
   * @typedef {ComplexDieInit<Side> & {sides: Iterable<Side>;} } ComplexDieInitWithIterableSides
   * @property {Iterable<Side>} sides The sides of the complex die.
   */
  /**
   * @override
   * @param {ComplexDieInitWithIterableSides<Side>} init
   */
  /**
   * @override
   * @param {ComplexDieInit<Side> & SimpleSideInit<Side>} init
   */
  /**
   * @override
   * @param {ComplexDieInit<Side> & ComplexSideInit<Side>} init
   */
  constructor(init) {
    this.#title = init.title;
    if ("sides" in init) {
      this.#sides = [...init.sides]
    } else {
      this.#sides = [...createSides(init)
      ]
    }
    this.#sideCaption = init.sideCaption ?? ((val) => String(val));
  }
  
  get title() {
    return this.#title
  }
  
  /**
   * @param {Side} side
   * @returns {string} The string value of the caption.
   */
  sideCaption(side) {
    return this.#sideCaption(side)
  }
  
  toString() {
    return this.title ?? `D[${this.sides.reduce(
    (acc, side, index) => (acc + (index ? "," : "") + this.sideCaption(side))
      , ""
    )}]`
  }
}

/**
 * @param {number} sideCount
 * @returns {DieModel<number>} The resulting die.
 */
export class SimpleDie {
  
  /**
   * The die sides.
   * @type {ReadonlyArray<number>}
   */
  #sides;
  
  #title;
  
  constructor(sideCount) {
    this.#sides = [...createSides({ sideCount: Math.trunc(sideCount) })]
    this.#title = `D${sideCount}`
  }
  
  get title() {
    return this.#title;
  }
  
  get sides() {
    return this.#sides;
  }
}