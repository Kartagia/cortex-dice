import { html, h} from 'htm/preact';
import { useState, useCallback } from "preact/hooks";

export function createId(prefix="id") {
  let result = `${prefix}${Math.trunc(Math.random()*(2**52)). toString(16)}`
  return result;
}

export function SelectOption(props) {
  let element = "option";
  let contentProps = {...props};
  let contents = [];
  if (["radio", "checkbox"].includes(props.type)) {
    element = InputField;
  } else {
    if (props.title) {
    contents.push(props.title)
    delete(contentProps.title)
    }
  }
  return h(element, {}, contents);
}
export function RadioGroup(props) {
  const id = props.id ?? createId("field");
const keyOf = props.keyOf ?? ((value, index) => `${index}`)
const label = props.label ? props.label : html`<label>${props.title}</label>`
const isObjectValue = typeof props.value === "object";
const value = (isObjectValue ? props.value.value : props.value)??"";
  const input = html`<div class="radio-group">
${
  props.values?.map(
    (entry, index) => html`<${InputField} key=${keyOf(entry.value,index)} type="radio" class="select-option" title=${entry.title} name=${props.name} id=${`${id}.${keyOf(entry.value, index)}`} value=${entry.value} checked=${entry.checked ?? entry.value === value} onchange=${props.onchange}/>`
  )
}
</div>`
if (props.inline) {
  return html`${label}${input}`
} else {
  return html`<div class=${props.class ?? "select-field"}>${label}${input}
</div>`
}
}

export function Select(props) {
  const id = props.id ?? createId("field");
const keyOf = props.keyOf ?? ((value, index) => `${index}`)
const label = props.label ? props.label : html`<label>${props.title}</label>`
  const input = html`<select name=${props.name} onchange=${props.onchange}>${props.values?.map(
  (value, index) => html`<option key=${keyOf(value)} value=${value.value} checked=${value.checked ?? value.value === props.value}>${value.title}</option>`
)}</select>`
if (props.inline) {
  return html`${label}${input}`
} else {
return html`<div class=${props.class ?? "select-field"}>${label}${input}
</div>`
}
}

export function SelectField(props) {
const input = props.type === "radiogroup" ?  
h(RadioGroup, props)
: h(Select, props)
return input
}

export function InputField(props) {
  const [value, setValue] = useState(props.value ?? ""  )
  const [error, setError] = useState(props.error)
  const id = props.id ?? createId("field")
  
  switch (props.type) {
    case "radiogroup":
    case "select":
        return h(SelectField,props)
    case "radio":
      
    default:
  }
  const onchange = (e) => {
    if (!(props.validator?.(e.target.value) ?? true)) {
      e.preventDefault()
      setError("Invalid value");
      setValue(e.target.value)
    } else {
    setValue(e.target.value)
    setError("")
    props.onchange?.(e);
    }
    
  }
  const input = html`<input 
  class=${props.inline && (props.class ?? 'input-field')}
  id=${id} type=${props.type}
  name=${props.name}
  value=${value} onchange=${onchange}/>`;
  if (props.inline) {
    return html`${props.label ?? props.title ? html`<label for=${id} class=${props.class ?? 'input-field'}>${props.title}</label>` : undefined}${input}${error && html`<div class="error">${error}</div>` }`
  } else {
  return html`<div class=${props.class ?? 'input-field'}>${props.label ?? props.title ? html`<label for=${id}>${props.title}</label>` : undefined}${input}${error && html`<div class="error">${error}</div>` }</div>`
  }
}