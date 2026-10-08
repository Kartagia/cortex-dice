import {expect} from "chai";
import {checkIndex, CortexRollResult, CortexDie, CortexPool} from "#model/cortex/index.js"

export function testNumberLike() {
  const numbers = [-1,1,3,2,15];
  
  describe("Adding to number works", () => {
    numbers.map(
      value => {
        const tested = {
          valueOf() {
            return value;
          }
        }
        const expected = value + tested.valueOf();
        it(`${value} + NumberLike(${tested.valueOf()}) = ${expected}`, () => {
          expect(() => {
            value + tested;
          }).not.throw()
          expect(tested + value).equals(expected)
        })
      }
    )
  })
describe("Adding number to works", () => {
  numbers.map(
      value => {
        const tested = {
          valueOf() {
            return value;
          }
        }
        const expected = value + tested.valueOf();
        it(`NumberLike(${tested.valueOf()}) + ${value}`, () => {
          expect(() => {
            tested + value;
          }).not.throw()
          expect(tested + value).equals(expected)
        })
      }
    )
})
describe("Conversion to number works", () => {
  numbers.map(
  value => {
    const tested = {
      valueOf() {
        return value;
      }
    }
    const expected = value;
    it(`NumberLike(${tested.valueOf()}) is ${expected}`, () => {
      expect(+tested).equal(expected)
    })
  }
)
})
describe("Adding numberlikes works", () => {
      numbers.map(
        value => {
          const tested = {
            valueOf() {
              return value;
            }
          }
          const other = {
            valueOf() {
              return value-1
            }
          }
          const expected = tested.valueOf() + other.valueOf();
          it(`NumberLike(${tested.valueOf()}) + Numberlike(${other}) =[${expected}`, () => {
            expect(tested + other).equal(expected)
          })
        }
      )
})
}