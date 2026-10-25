/**
 * @typedef {readonly [string, string]} CategoryMemberTargetPath
 */


/**
 * @typedef Target
 * @property {string} name - the target name.
 */

/**
 * @typedef {Target & {category: string}} TraitTargetModel
 * @property {string} category - the target trait category.
 */

/**
 * @template {Target} [TTarget=TraitTarget]
 * @typedef {TTarget & {actor: string} } ActorTargetModel
 */

/**
 * @typedef DieTargetModel
 * @property {CortexDie} die - the target die.
 */
/**
 * @typedef AssetTargetModel
 * @property {string} name - the asset name.
 */
/**
 * @typedef ComplicationTargetModel
 * @property {string} name - the complication name.
 */
/**
 * @typedef PoolCondition
 * @property {TraitTargetModel|AssetTargetModel|ComplicationTargetModel|DieTargetModel} target - the condition target selecting tested dice.
 * @property {boolean} [complement] - is test negated.
 * @property {CortexDie} [minValue] - the smallest accepted die size 
 * @property {CortexDie} [maxValue] - the largest accepted die size.
 * @property {number} [minCount] - the minimum number of times the pool dice matches.
 * @property {number} [maxCount] - the maximum number of times the pool matches.
 */

/**
 * @typedef {PoolCondition & ({hitch?: boolean;}|{selected?:boolean;}|{effect?:boolean;})} ResultCondition
 * @property {boolean} [hitch] - the rolled die is a hitch.
 * @property {boolean} [selected] - the rolled die is a selected die.
 * @property {boolean} [effect] - the rolled die is an effect die.
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
 * @param {Condition<DieTargetModel>} condition
 * @param {ReadonlyArray<CortexDie@>} dice
 */
export function checkDieCondition(condition, dice) {
  
}


export function checkCondition(condition, context) {
  
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