import { expect } from 'chai';
import { createSides } from "#model/dice.js";
const suites = []
const cases = []

export function testSimpleSides() {
  describe(
    "Simple sides with sideCount",
    function() {
      [2, 3, 4, 6, 8, 10].forEach(
        sideCount => {
          it(
            `A ${sideCount} die`, function() {
            const result = createSides({ sideCount });
            expect([...result]).length(sideCount)
          })
        }
      )
    })
}


export function testCreateSides() {
  testSimpleSides();
}
suites.push([testCreateSides, "createSides"])

export function testDice() {
  describe("Dice", function() {
    suites.forEach(test => {
      const [testFn, title] = Array.isArray(test) ? test : [test, test.name];
      describe(
        title,
        testFn.bind(this)
      );
    });
    cases.forEach(test => {
      const [testFn, title] = Array.isArray(test) ? test : [test, test.name];
      it(title, testFn.bind(this));
    })
  })
}

