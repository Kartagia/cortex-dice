import {expect} from 'chai'
import {getPathSegmentValidator, isTargetPath} from "#model/cortex/path.js"


export function testTargetPath() {
  
  describe("getPathSegmentValidator",() => {
    [
      ...([["v", "Ä", "vänKääk"], [".", "AbbaZil"], ["."] ].map(
        (tested) => ({
          get tested() {
            return tested;
          },
          get title() {
            return `Valid "${this.tested}"`
          },
          get options() {
            return undefined
          },
          get expected() {
            return true;
          }
        })))
    ].map(
      async (tested) => {
        it(`${tested.title}`, ()=>{
          const result = getPathSegmentValidator(tested.options);
          expect(tested.tested.every(result), "RegExp did not match a valid path").equal(tested.expected)
        }
        )
      }
    )
  })
  describe("isTagetPath", () => {
    [
      ...([["v", "Ä", "vänKääk"],[], [""]].map(
        (tested) => ({
          get tested() {
            return tested;
          },
          get title() {
            return `[${this.tested.map(s => `"${s}"`).join(",")}]`
          },
          get options() {
            return undefined
          },
          get expected() {
            return true;
          }
        }))),
        ...[["Foo", ""],[" "], ["3"]].map(
          tested => ({
            
            get tested() {
              return tested
            },
            get title() {
    return `[${this.tested.map(s => `"${s}"`).join(",")}]`
  },
  get options() {
    return undefined
  },
            get expected() {
              return false;
            }
          })
        )
    ].map(
      async (tested) => {
        it(`${tested.expected ? "Valid" : "Invalid"}  ${tested.title}`, ()=>{
          const result = isTargetPath(tested.tested, tested.options);
          expect(result).equal(tested.expected)
        }
        )
      }
    )
  })
}

export default function() {
  describe("TargetPath",
  testTargetPath.bind(this));
}