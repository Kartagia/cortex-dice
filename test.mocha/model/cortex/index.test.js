import {expect} from "chai";
import {testNumberLike} from "./numberlike.test.js"
import {checkIndex, CortexRollResult, CortexDie, CortexPool} from "#model/cortex/index.js"
const suites =[]
const cases = []
cases.push(
  ["Test loaded", () => it("Test works", () => {})],
  ["NumberLike", testNumberLike]
)

export function testCortexRollResult() {
  const createCases = [
    {
      title: "Empty result",
      param: [],
      expected: {
        selected: [],
        available: [],
        hitches: [],
        effect: [],
        result: 0
      }
    },
    {
      title: "Two selected dice D4(2) and D8(5)",
      param: [[CortexDie.DICE[0], 2, true], [CortexDie.DICE[2],5, true]],
      expected: {
        selected: [[CortexDie.DICE[0], 2, true], [CortexDie.DICE[2],5, true]],
        available: [],
        hitches: [],
        effect: [],
        result: 7
      }
    },
    {
      title: "Two selected dice D4(2) and D8(5), and unselected dice D10(5), D4(2), D6(2)",
      param: [[CortexDie.DICE[0], 2, true], [CortexDie.DICE[2],5, true], [CortexDie.D10,5], [CortexDie.D4,2], [CortexDie.D6,2]
      ],
      expected: {
        selected: [[CortexDie.DICE[0], 2, true], [CortexDie.DICE[2],5, true]],
        available: [
          [CortexDie.D10,5], [CortexDie.D4,2], [CortexDie.D6,2]
        ],
        hitches: [],
        effect: [],
        result: 7
      }
      },
    {
      title: "Two selected dice D4(2) and D8(5), effect die D10(5), and unselected dice D10(5), D4(2), D6(2)",
      param: [[CortexDie.DICE[0], 2, true], [CortexDie.DICE[2],5, true], [CortexDie.D10,5,"effect"], [CortexDie.D4,2], [CortexDie.D6,2]
      ],
      expected: {
        selected: [[CortexDie.DICE[0], 2, true], [CortexDie.DICE[2],5, true]],
        available: [
           [CortexDie.D4,2], [CortexDie.D6,2]
        ],
        hitches: [],
        effect: [
          [CortexDie.D10,5,"effect"]
        ],
        result: 7
      }
    },
    {
      title: "Two selected dice D4(2) and D8(5), and unselected dice D10(5), D4(2), D6(2), and hitch D12(1)",
      param: [[CortexDie.DICE[0], 2, true], 
      [CortexDie.D12,1],
      [CortexDie.DICE[2],5, true],
        [CortexDie.D10,5], [CortexDie.D4,2], [CortexDie.D6,2]
      ],
      expected: {
        selected: [[CortexDie.DICE[0], 2, true], [CortexDie.DICE[2],5, true]],
        available: [
          [CortexDie.D10,5], [CortexDie.D4,2], [CortexDie.D6,2]
        ],
        hitches: [
          [CortexDie.D12,1]
        ],
        effect: [],
        result: 7
      }
    },
    
  ]
  describe("Construction", () => {
    const cases = Promise.allSettled(createCases.map(
      async testCase => it(testCase.title, () => {
        const ref = {}
        expect(() => {ref.current = new CortexRollResult(testCase.param)}).not.throw();
        expect(ref.current).not.undefined
        expect(ref.current.result).equal(testCase.expected.result);
        ["selected", "available", "hitches", "effect"].forEach(
          prop => {
        expect(ref.current[prop], `The ${prop} was not equal`).eql(testCase.expected[prop]
        )
          }
        )
      })
    ));
  })
}
suites.push(["Test CortexRollResult", testCortexRollResult])

/**
 * Test check index.
 */
export function testCheckIndex() {
  it("Negative index is rejected", () => {
    expect(() => {
      checkIndex(-1, {length: 0})
    }).throw(RangeError)
  })
  it("Length is rejected",
    () => {
    expect(() => {
      checkIndex(2, {length: 2})
    }).throw(RangeError)
    }
  )
  it("Valid integer index 0 is accepted",
    () => {
  expect(checkIndex(0, { length: 1 })).equal(0)
    }
  )
  it("Valid integer index 0 is accepted with max index 0",
    () => {
  expect(checkIndex(0, { length: 2, maxIndex: 0})).equal(0)
    }
  )
  it("Valid integer index 1 is accepted with min index 1",
    () => {
  expect(checkIndex(1, { length: 2, minIndex: 1})).equal(1)
    }
  )
  it("Valid index 0 is rejected with minIndex 1",
    () => {
    expect(() => {
      checkIndex(0, {length: 2, minIndex:1})
    }).throw(RangeError)
    }
  )
  it("Valid integer index 1 is accepted with min index 1",
  () => {
    expect(checkIndex(1, { length: 2, minIndex: 1 })).equal(1)
  }
)
it("Index 1.05 is truncated with truncate",
  () => {
    expect(checkIndex(1.05, { length: 2, truncate: true })).equal(1)
  }
)
it("Valid string index '1' is accepted with evaluate",
    () => {
  expect(checkIndex("1", { length: 2, evaluate: true})).equal(1)
    }
  )
  it("Invalid index '2a' is rejected with evaluate",
  () => {
    expect(() => {
      checkIndex("2a", { length: 3, evaluate: true})
    }).throw(RangeError)
  }
)
}
suites.push(["Test checkIndex", testCheckIndex])

export function testModelCortex() {
  describe("Model Cortex", function() {
  suites.map(
    testSuite => describe(testSuite[0], testSuite[1]?.bind(this))
  )
  cases.map(
    testSuite => it(testSuite[0], testSuite[1]?.bind(this))
  )
  })
}