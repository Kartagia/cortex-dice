import {expect} from 'chai';
import { defaultCompare, filterByBestValue, filterIndexByBestValue} from "#model/compare.js"
const suites = []
const cases = []
export function testDefaultCompare() {
  const validCases = [
    ...[ [0,0], [0.0, -0.0], [-1, 1], [-1, 0],[0,1], 
    ["", "A"], ["A", "a"], ["5", '5a'],
    [false, 0]
    ].flatMap(
      t => (t[0] < t[1] ? [{
            title: `${String(t[0])} less than ${String(t[1])}`,
            param: t,
            expected: -1
        },
        {
            title: `${t[0]} equals ${t[0]}`,
            param: [t[0], t[0]],
            expected: 0
          },
          {
            title: `${t[1]} is greater than ${t[0]}`,
            param: [t[1], t[0]],
            expected: 1
          }
      ]:[
          {
            title: `${String(t[0])} equals ${String(t[1])}`,
            param: t,
            expected: 0
          }
        ])
      
    ),
    {
      title: "Infinity is equal to Infinity",
      param: [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
      expected: 0,
    },
    {
      title: "5 compare '5' is 0",
      expected: 0,
      param: [5, '5']
    }
  ].map( (t) => ({...t, tested: defaultCompare}));
  validCases.map(
    testCase => it(testCase.title, () => {
      expect(testCase.tested(...testCase.param)).equal(testCase.expected)
    })
  )
  
  const invalidCases = [
    {
      title: "Number 5 does no compare with non-numeric string",
      param: [5, "5a"],
      error: SyntaxError
    },
    {
      title: "NaN is not comparable",
      param: [Number.NaN, Number.NaN],
      error: SyntaxError
    }
  ].map( t => ({...t, tested: defaultCompare}))
  invalidCases.map(
    testCase => it(testCase.title,
      () => {
        expect(() => {testCase.tested(...testCase.param)}).throw(testCase.error)
      }
    )
  )
}
suites.push([testDefaultCompare,"Test defaultCompare"])

export function testFilterIndexByBestValue() {
  describe("With default compare", () => {
  
})
describe("With numberic compare", () => {
  const compare = (a,b) => {
    if (typeof a === typeof b && typeof a === "number" && !Number.isNaN(a) && !Number.isNaN(b)) {
      return defaultCompare(a,b)
    }
    throw new SyntaxError("Can only compare numbers")
  }
  const validCases = [
    {
      param: [[1,2,3], 2, compare],
      expected: [1,2]
    },
    {
      param: [[3,2,1], 2, compare],
      expected: [1,0]
    },
    {
      param: [[1,2,3], -1, compare],
      expected: [1,2]
    }
  ].map( t => ({
    ...t,
    get title() {
        return `Get ${this.param[1]} best from [${this.param[0]}]`
      },
    tested: filterIndexByBestValue
  }));
  validCases.map(
    testCase => it(testCase.title, () => {
      const result = testCase.tested(...testCase.param);
      expect(result).eql(testCase.expected)
    })
  )
})
}
suites.push([testFilterIndexByBestValue, "filterIndexByBestValue"])
export function testFilterByBestValue() {
  describe("With default compare", () => {
    
    describe("With numberic compare", () => {
  const compare = (a,b) => {
    if (typeof a === typeof b && typeof a === "number" && !Number.isNaN(a) && !Number.isNaN(b)) {
      return defaultCompare(a,b)
    }
    throw new SyntaxError("Can only compare numbers")
  }
  const validCases = [
    {
      param: [[1,2,3], 2, compare],
      expected: [2,3]
    },
    {
      param: [[3,2,1], 2, compare],
      expected: [2,3]
    },
    {
      param: [[1,2,3], -1, compare],
      expected: [2,3]
    }
  ].map( t => ({
    ...t,
    get title() {
        return `Get ${this.param[1]} best from [${this.param[0]}]`
      },
    tested: filterByBestValue
  }));
  validCases.map(
    testCase => it(testCase.title, () => {
      const result = testCase.tested(...testCase.param);
      expect(result).eql(testCase.expected)
    })
  )
})
  })
  
}
suites.push([testFilterByBestValue, "filterByBestValue"])

export function testModelCompare() {
  describe("Compare", function() {
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