import { expect } from 'chai';
import { IconOptions } from "#model/card-shared.js"
import { DIAMOND, VALUES } from "#model/cards.js"
const suites = [];
const cases = [];

export function testIconOptions() {
  describe("Without cards", function() {
    
  })
  describe("With card range", function() {
    it("Glyph range from 'a' to 'e'", function() {
      const result = new IconOptions({
        solid: "Ae",
        firstCard: 'a',
        lastCard: 'e'
      });
      expect(result.solid).eql("Ae")
      expect(result.cards).eql(['a', 'b', 'c', 'd', 'e'])
    })
    it("Glyph range from undefined to 'a' throws SyntaxError", function() {
      expect(() => {
        const result = new IconOptions({
          solid: "Ae",
          lastCard: 'a'
        });
      }).throw(SyntaxError)
    })
    it("Glyph range from 'a' to undefined throws SyntaxError", function() {
      expect(() => {
        const result = new IconOptions({
          solid: "Ae",
          firstCard: 'a'
        });
      }).throw(SyntaxError)
    })
  });
  describe("With cards", function() {
      [
        {
          title: "Empty cards",
          tested: {
            solid: "A",
            cards: {
              [Symbol.iterator]() {
                return { 
                  next() { 
                    return { 
                      done: true 
                      
                    } 
                    
                  } 
                  
                }
                
              }
            }
          },
          expected: {
            solid: "A",
            cards: []
          }
        },
        {
          title: "Diamond cards",
          tested: DIAMOND.icon,
          expected: {
            solid: "\u2666",
            outline: "\u2662",
            cards: VALUES.map(
              value => String.fromCodePoint(0x1f0c0+value.value)
            )
            
          }
        },
        
      ].forEach(
        testCase => {
          if ("exception" in testCase) {
            it(testCase.title,
              () => {
                expect(() => {
                  new IconOptions(testCase.tested)
                }).throw(testCase.exception)
              })
        } else {
          it(testCase.title, () => {
            const result = new IconOptions(testCase.tested);
            expect(result.cards).eql(testCase.expected.cards)
          })
        }
      }
    )
  })
}
suites.push([testIconOptions, "new IconOptions"])

export function testCards() {
  describe("Cards", function() {
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

export default testCards;