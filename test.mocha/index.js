import {testCards} from "#test/model/cards.test.js"
import {testDice} from "#test/model/dice.test.js"
import {testCombinations } from "#test/model/combination.test.js"
import {testModelCompare} from "#test/model/compare.test.js"
import {testModelCortex} from "#test/model/cortex/index.test.js";
describe("Tests suite", function() {
  it("Test works", function() {})
  testModelCortex.bind(this)();
  describe("Model compare", testModelCompare.bind(this))
  describe("Model combinations", testCombinations.bind(this))
  describe("Dice", testDice.bind(this))
  describe("Cards", testCards.bind(this))
})