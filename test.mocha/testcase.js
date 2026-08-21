import {expect} from "chai"
/**
 * @template TESTED
 * @template [EXPECTED=void]
 * @template {ERROR extends Error|ErrorCondtructor} [ERROR=Error]
 * @typedef {object} ErrorTestCase
 * @property {string} title
 * @property {TESTED} tested
 * @property {(tested: TESTED) => EXPECTED} testFn
 * @property {ERROR} exception The exception thrown.
 */
/**
 * @template TESTED
 * @template [EXPECTED=void]
 * @typedef {object} SuccessTestCase
 * @property {string} title
 * @property {TESTED} tested
 * @property {(tested: TESTED) => EXPECTED} testFn
 * @property {EXPECTED} expected The expected result.
 */
/**
 * @template TESTED
 * @template [EXPECTED=void]
 * @template {ERROR extends Error|ErrorCondtructor} [ERROR=Error]
 * @typedef {SuccessTestCase<TESTED, EXPECTED>|ErrorTestCase<TESTED,EXPECTED, ERROR@>} TestCase
 */
/**
 * @template TESTED
 * @template [EXPECTED=void]
 * @template {ERROR extends Error|ErrorCondtructor} [ERROR=Error]
 * @param {TestCase<TESTED, EXPECTED, ERROR>} testCase
 */
export function testTestCase(testCase) {
  if ("exception" in testCase) {
    it(testCase.title, function() {
    expect(() => {
      testCase.testFn(testCase.tested);
    }).to.throw(testCase.exception);
    });
  } else {
    it(testCase.title, function() {
      const result = {};
      expect(() => {
        result.value = testCase.testFn(testCase.tested)
      }
      ).not.throw();
      if ("validator" in testCase) {
        expect(testCase.validator(result.value, testCase.expected)).true;
      } else {
        expect(result.value).eql(testCase.expected)
      }
    });
  }
}