import {isTargetPath} from "./path.js"
 
 /**
 * @typedef {readonly [string, string]} CategoryMemberTargetPath
 */

/**
 * @extends {TypeGuard<ReadonlyArray<CortexDie>>}
 */
export function isCortexDicePool(value, opt = undefined) {
  return Array.isArray(context) && context.every( c => c instanceof CortexDie)
}

/**
 * @typedef Target
 * @property {string} name - the target name.
 */

/**
 * @typedef {Target & {category: string}} TraitTargetModel
 * @property {string} category - the target trait category.
 */

/**
 * @template {TraitTargetModel} [TTarget=TraitTargetModel]
 * @typedef {TTarget & {actor: string} } ActorTargetModel
 */

/**
 * @typedef DieTargetModel
 * @property {CortexDie} die - the target die.
 */
/**
 * @typedef {TraitTargetModel} AssetTargetModel
 * @property {"asset"} category - the trait category.
 * @property {string} name - the asset name.
 */
/**
 * @typedef {TraitTargetModel} ComplicationTargetModel
 * @property {"complication"} category - the trait category.
 * @property {string} name - the complication name.
 */
/**
 * A condition for a dice pool limited Sfx.
 * @typedef PoolCondition
 * @property {TraitTargetModel|AssetTargetModel|ComplicationTargetModel|DieTargetModel} target - the condition target selecting tested dice.
 * @property {boolean} [complement] - is test negated.
 * @property {CortexDie} [minValue] - the smallest accepted die size 
 * @property {CortexDie} [maxValue] - the largest accepted die size.
 * @property {number} [minCount] - the minimum number of times the pool dice matches.
 * @property {number} [maxCount] - the maximum number of times the pool matches.
 */

/**
 * A die condition including result limitation.
 * - If more than one condition is set, any matching result condition is accepted;
 * @typedef {PoolCondition & ({hitch?: boolean; selected?:boolean; effect?:boolean; available?:boolean}} ResultCondition
 * @property {boolean} [hitch] - the rolled die is a hitch.
 * @property {boolean} [selected] - the rolled die is a selected die.
 * @property {boolean} [effect] - the rolled die is an effect die.
 * @property {boolean} [available] - the die is available.
 */

/**
 * @template  {string|PoolCondition|ResultCondition} [TTarget=string|PoolCondition|ResultCondition]
 * @typedef {TTarget} Condition
 */

/**
 * @typedef SfxEffectModel
 * @property {TargetPath|Target} target - the target of the effect
 * @property {Condition} [condition] - the optional condition of the effect step. The effect is ignored on faiked condition.
 */

/**
 * @overload
 * @param {Condition<PoolCondition>} condition
 * @param {ReadonlyArray<CortexDie>} dice
 * @return {ReadonlyArray<[CortexDie, number]>}
 */
export function checkDieCondition(condition, dice) {
  const predicate = (die, index, allDice) => {
    if (condition.minValue && die.compare(condition.minValue) < 0) return false;
    if (condition.maxValue && die.compare(condition.maxValue) > 0) return false;
    return true;
  }
  const passed = dice.reduce(
    (acc, die, index, allDice) => {
      if (predicate(die, index, allDice)) {
        acc.push([die, index])
      }
      return acc
    },
    []
  )
  if ("maxCount" in condition && passed.length > condition.maxCount) return undefined;
  if ("minCount" in condition && passed.length < condition.minCount) return undefined;
  return passed;
}


export function checkCondition(condition, context) {
  let passed = undefined;
  if ("die" in condition) {
    if (isCortexDicePool(context)) {
    passed = checkDieCondition(condition, context)
    } else if ("dice" in context && isCortexDicePool(context.dice)) {
      passed = checkDieCondition(condition, context.dice)
    } else {
      return undefined;
    }
  }
  
  if (passed?.length ?? 0 === 0) return undefined;
  return passed;
}

/**
 * @typedef SfxModel
 * @property {string} name - the name of the SFX.
 * @property {number} [cost] - the cost to activate.
 * @property {string} [title] - the title of the SFX.
 * @property {ReadonlyArray<SfxEffectModel>} [effects] - the effects of the SFX in the order of execution.
 * @property {Condition} [condition] - the condition of the trigger.
 */

/**
 * @typedef {SfxModel} SfxInit
 */

/**
 * @extends {SfxModel}
 */
export class Sfx {
  #name;
  #title;
  #cost;
  #effects = []
  #condition;
  
  /**
   * @param {SfxInit} init 
   */
  constructor(init) {
    this.#condition = init.condition;
    this.#effects.push(...(init.effects ?? []))
    this.#name = init.name;
    this.#title = init.title ?? capitalize(init.name)
    this.#cost = init.cost ?? 1
  }
  get name() {
    return this.#name;
  }
  get title() {
    return this.#title;
  }
  get cost() {
    return this.#cost;
  }
  get id() {
    return this.name;
  }
  get effects() {
    return [...this.#effects];
  }
  
  toString(verbose = false) {
    return `${this.title}${this. cost ? "("+ this.cost+"PP)" : ""}${
      verbose && this.effects.length ? ":" + this.effects.map(
        effect => String(effect)
      ).join(";"): ""
    }`
  }
}