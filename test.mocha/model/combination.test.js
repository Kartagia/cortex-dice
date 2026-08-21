import { expect } from 'chai';
import { parseInt } from "#model/parse.js"
import { Limit, intCompare, limitPredicate, DieCode } from "#model/diecode.js"
import { testTestCase } from "#test/testcase.js"

const suites = []
const cases = []

export function testLimit() {
  describe("intCompare", function() {
    it("MIN_SAFE_INTEGER cmp 0", function() {
      expect(intCompare(Number.MIN_SAFE_INTEGER, 0)).equal(-1)
    })
    it("MIN_SAFE_INTEGER cmp MAX_SAFE_INTEGER", function() {
      expect(intCompare(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)).equal(-1)
    })
  })
  describe("limitPredicate", function() {
    const compare = intCompare;
    it("int <= 0", function() {
      const test = limitPredicate(intCompare, 0, "<=");
      expect(test(0)).true;
      expect(test(Number.MIN_SAFE_INTEGER)).true;
    })
  })
  describe("construction", function() {
    [
      {
        title: "Integer default op 5",
        tested: [intCompare, 5],
        expected: {
          operator: ">=",
          threshold: 5
        }
      },
      {
        title: "Integer > 5",
        tested: [intCompare, 5, ">"],
        expected: {
          operator: ">",
          threshold: 5
        }
      }
      
    ].forEach(
      testCase => {
        return it(testCase.title, function() {
          const result = testCase.tested.length === 2 ?
            new Limit(testCase.tested[0], testCase.tested[1]) : new Limit(testCase.tested[0], testCase.tested[1], testCase.tested[2]);
          console.table({
            op: result.operator,
            threshold: result.threshold
          })
          console.table({
            op: testCase.expected.operator,
            threshold: testCase.expected.threshold
          })
          expect(result.operator).equal(testCase.expected.operator)
          expect(result.threshold).equal(testCase.expected.threshold)
          return true;
        })
      }
    )
  })
  describe("parse", function() {
    [
    {
      title: "Less than 5",
      tested: ["<5", {
        compare: intCompare,
        parse: parseInt
      }],
      expected: {
        operator: "<",
        threshold: 5
        
      }
    }].forEach(
      testCase => it(testCase.title, function() {
        const result = Limit.parse(...testCase.tested);
        expect(result.operator).equal(testCase.expected.operator)
        expect(result.threshold).equal(testCase.expected.threshold)
      })
    )
  })
}
suites.push(testLimit)

export function testDieCode() {
  const defaultGroups = {
    botch: undefined,
    success: undefined,
    crit: undefined,
    keep: undefined,
    drop: undefined
  };
  describe("Regexp ", function() {
    const testFn = (code) => DieCode.dieCodeRegExp().exec(code);
    const validator = (result, expected) => {
      expect(result.groups).eql(expected.groups)
      return true;
    };
    const testCases = [
    {
      title: "1d6",
      tested: "1d6",
      expected: {
        0: "1d6",
        1: "1",
        2: "2",
        groups: {
          ...defaultGroups,
          "count": "1",
          "sides": "6",
          
        }
      },
      testFn,
      validator,
    },
       {
   title: "2d4",
   tested: "2d4",
   expected: {
     0: "2d4",
     1: "2",
     2: "4",
     groups: {
       ...defaultGroups,
       "count": "2",
       "sides": "4",
       
     }
   },
   testFn,
   validator,
 },
  {
      get title() {return this.tested},
      tested: "5d8k1d2TN>6c=8b<2",
      expected: {
        0: "5d8k1d2tn>6c=8b<2",
        1: "5",
        2: "8",
        3: "1",
        4: "2",
        5: ">6",
        6: "=8",
        7: "<2",
        groups: {
          ...defaultGroups,
          "count": "5",
          "sides": "8",
          "keep": "1",
          "drop": "2",
          "success": ">6",
          "crit": '=8',
          "botch": "<2"
        }
      },
      testFn,
      validator,
  },
 {
   title: "2d6k1",
   tested: "2d6k1",
   expected: {
     0: "2d6+1",
     1: "2",
     2: "6",
     3: "1",
     groups: {
       ...defaultGroups,
       "count": "2",
       "sides": "6",
       "keep": "1"
       
     }
   },
   testFn,
   validator,
 }
    ]
    testCases.forEach(
      testTestCase.bind(this)
    )
  })
  describe("Static method parseSimpleDieCode", function() {
    const testFn = (code) => DieCode.parseSimpleDie(code);
    const defaultGroups = {
      botch: undefined,
      success: undefined,
      crit: undefined,
      keep: undefined,
      drop: undefined
    };
    const testCases = [
    {
      title: "Parse 1d6",
      tested: "1d6",
      expected: new DieCode({
        ...defaultGroups,
        count: 1,
        sides: [1, 2, 3, 4, 5, 6]
      }, intCompare),
      testFn
    },
    {
      title: "Parse d6",
      tested: "d6",
      expected: new DieCode({
        ...defaultGroups,
        count: 1,
        sides: [1, 2, 3, 4, 5, 6]
      }, intCompare),
      testFn
    },
    {
      title: "Parse 2d6k1",
      tested: "2d6k1",
      expected: new DieCode({
        ...defaultGroups,
        count: 2,
        sides: [1, 2, 3, 4, 5, 6],
        keep: 1
      }, intCompare),
      testFn
    }]
    testCases.forEach(
      testTestCase.bind(this)
    )
  })
}
suites.push(testDieCode)
export function testCombinations() {
  describe("Combinations", function() {
    suites.forEach(test => {
      const [testFn, title] = Array.isArray(test) ? test : [test, test.name];
      describe(title, testFn.bind(this));
    })
    cases.forEach(test => {
      const [testFn, title] = Array.isArray(test) ? test : [test, test.name];
      it(title, testFn.bind(this));
    })
  })
}

export default testCombinations;