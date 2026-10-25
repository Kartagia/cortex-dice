import { CortexDie as CortexDieModel } from "#model/cortex/index.js"
import { html, h } from 'htm/preact'
import { createRef } from 'preact';
export { useState } from 'preact/hooks'

/**
 * @property {CortexDieModel} model - the model of the die.
 * @property {string} [class] - the class of the die.
 * @property {MouseEventListener<HTMLElement>} [onclick] - the mouse event listener. 
 */
/**
 * A cortex die component.
 * @param {CortexDieProps}
 */
export function Die(props) {
  
  const model = props.model;
  return html`<div class="${props.class ?? "dice"}" onclick=${props.onclick}><header>${props.title ?? model.title}</header>${props.children}
  <footer>${props.actions?.map(
    action => h("div", {
      onclick: (e) => {
        props.onAction?.(action)
      }
    },
      action.title ?? action.name
    )
  )}</footer></div>`
}

export function DieResult(props) {
  const [result, setResult] = useState(props.value ?? props.defaultValue);
  const onAction = (action) => {
    switch (action.name) {
      case "roll":
        if (result === undefined) {
          setResult(r => {
            return props.model?.roll() ?? r
          })
          return;
        }
      case "reroll":
        if (props.value === undefined) {
          // Uncontrolled value
          setResult(r => {
  return props.model?.roll() ?? r
})
return;
        }
      default:
        props.onAction?.(action)
    }
  }
  const model = props.model;
  return html`<${Die}
  class="${props.class ?? "dice"}"
  onclick=${props.onclick}
  onAction=${onAction}
  actions=${props.actions}
  model=${props.model}
  title=${props.title}
  ><div class="result">${props.result}</div></${Die}>`
}

export function DicePool(props) {
  const dice = [...props.dice ?? []]
  const ref = props.ref ?? createRef()
  const handleClick = async (dieModel, index, e) => {
    console.group(`Click on ${dieModel.title}@${index}`)
    try {
      if (e.target) {
        console.log("Target %s", e.target.nodeName);
        if (ref.current) {
          const event = new CustomEvent("dieSelect", { detail: { dieModel, index } })
          return new Promise((resolve, reject) => {
            try {
              console.group("Dispatch event %s", event.type)
              ref.current.dispatchEvent(event)
              if (props.onDieSelect) {
                props.onDieSelect(event)
                console.log("Property handler called")
              }
              resolve()
              console.log("Event dispatched")
            } catch (err) {
              console.error(err)
              reject()
            } finally {
              console.groupEnd()
            }
          })
        }
      } else {
        console.log('No target')
      }
      if (props.onclick) {
        props.onclick(e)
        console.log('Listener called')
      } else {
        console.log('No listener')
      }
    } finally {
      console.groupEnd()
    }
  }
  return html`<div ref=${ref} class=${props.class ?? "dice-pool"}>${
    dice.map(
      (die, index, dice) => {
        return h(Die, {key: `${die.title}-${dice.slice(0, index).filter( t => t.title === die.title).length}`, model: die, onclick: handleClick.bind(undefined, die, index) })
      }
    )
  }</div>`
}

export function Sfx(props) {
  
  return html`<div class=${props.class ?? "sfx"}>
  <header class=${props.model.used ? "used" : "unused"}>${props.model.title}</header>
  
  </div>`
}

/**
 * @typedef {"build"|"rolled"|"completed"} CortexRollMode
 */

/**
 * @typedef CortexRollDetail
 * @property {ReadonlyArray<CortexDieModel|CortexAssetModel|CortexTraitModel>} dice - the roll model
 * @property {CortexRollMode} [mode] - the cortex roll mode.
 */
 
/**
 * @typedef CortexEvents
 * @property {TypedMouseEvent<HTMLElement>} [onclick] - the on click event handler 
 * @property {(mode: CortexRollMode) => void} [onMode] - the event handler on mode change.
 */

/**
 * @typedef {CortexRollDetail & CortexRollEvents} CortexRollProps
 */

/**
 * Create a dice roll.
 * @param {CortexRollProps} props
 */
export function DiceRoll(props) {
  const [mode, setMode] = useState(props.mode ?? "build")
  const [result, setResult] = useState({
    selected: [],
    selectedCount: 2,
    effect: [],
    effectCount: props.effect?1:0
  })
  const [pointCost, setPointCost] = useState(props.pointCost ?? 0)
  const [dice, setDice] = useState(props.dice ?? [])
  const [sfxed, setSfxes] = useState(props.sfx ?? [])
  const sfxClick = (e) => {
    e.preventDefault()
    if (e.detail.used) {
      if (e.detail.cost) {
        setPointCost(pp => e.detail.cost ? pp - e.detail.cost : pp)
      }
      setSfxes(
        (c) => {
          return c.reduce(
            (acc, sfx, index) => {
              if (index === e.detail.index) {
                return [...acc, { ...sfx, used: false }]
              } else if (acc === c) {
                return acc;
              } else {
                return [...acc, sfx]
              }
            },
            c
          )
        }
      )
    } else {
      if (e.detail.cost) {
        setPointCost(pp => e.detail.cost ? pp + e.detail.cost : pp)
      }
      setSfxes(
        (c) => {
          return c.reduce(
            (acc, sfx, index) => {
              if (index === e.detail.index) {
                return [...acc, { ...sfx, used: true }]
              } else if (acc === c) {
                return acc;
              } else {
                return [...acc, sfx]
              }
            },
            c
          )
        }
      )
    }
  }
  const actions = mode === "build" ? [
    {
      title: "Add complication",
      name:"complication.add",
      disabled: true
    },
    {
      title: "Add resource",
      name: "resource.add",
      disabled: true
    },
    {
      title: "Accept", name: "accept", disabled: dice.count == 0},
    {title: "Reject", name: "close"}
  ] : [
    {title: "Add result(1PP)", name: "result.add", cost: 1},
    {title: "Add effect(1PP)",
      name: "effect.add", cost: 1
    },
    {
      title: "Accept", name: "accept", disabled: (result.selected.length < result.minSelected || result.effect.length < result.effect.count) && result.available.length > 0},
    {title: "Reject", name: "close"}
  ];
  
  return html`<div><${DicePool} dice=${dice}/><div class="status">
  <div>${pointCost}</div>
  <div class="sfx-list">${sfxes.map(
    sfx => html`<${Sfx} 
    onclick=${sfxClick}
    model=${sfx}/>`
  )}</div>
  </div class="options">${
    diceOptions.map(
      (model) => html`<${Die} />`
    )
  }<footer>
  ${actions.map(
  action => h("div", {
    class: "action",
    onclick: () => {
      onAction(action)
    }
  }, action.title ?? action.name)
    )
  }
  </footer></div>`
}