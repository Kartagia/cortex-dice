import {h, html, render} from 'htm/preact';
import {App} from '#app'
render(html`<${App}/>`, document.getElementById("app"))