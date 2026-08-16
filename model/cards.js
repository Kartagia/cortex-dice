import {IconOptions} from "././card-shared.js"
/**
 * @module model/cards
 */

export const HIDDEN = Object.freeze({
  /**
   * The icon definitions.
   */
  icon: new IconOptions({
    /**
     * The solid icon glyph.
     */
    solid: String.fromCodePoint(0x1f0a1),
    /**
     * The outline icon glyph.
     */
    get outline() {
      return this.solid
    },
    toString() {
      return this.solid;
    },
    /**
     * The first card of the suite.
     */
    get firstCard() {
      return this.solid
    },
    /**
     * The last card of the suite.
     */
    get lastCard() {
      return this.solid;
    },
    /**
     * The cards of the suite.
     */
    get cards() {
      return [this.solid]
    }
    
  }),
  /**
   * The captions of the suite.
   */
  caption: {
    /**
     * The singular caption.
     */
    singular: "Face Down",
    /**
     * The plural caption.
     */
    plural: "Deck",
    toString() {
      return this.singular;
    }
  }
})

export const TRUMP = Object.freeze({
  icon: new IconOptions({
    cards: [
      String.fromCodePoint(0x1f0cf),
      String.fromCodePoint(0x1f0df),
      String.fromCodePoint(0x1f0ef),
    ]
  }),
  caption: {
    singular: "joker",
    plural: "jokers",
    toString() {
      return this.singular
    }
  }
})

export const SPADE = Object.freeze({
  icon: new IconOptions({
    solid: "\u2663",
    outline: "\u2664",
    firstCard: String.fromCodePoint(0x1f0a1),
    lastCard: String.fromCodePoint(0x1f0ae)
  }),
  caption: {
    tarot: "swords",
    singular: "spade",
    plural: "spades",
    toString() {
      return this.singular;
    }
  }
})

export const CLUB = Object.freeze({
  icon: new IconOptions({
    solid: "\u2661",
    outline: "\u2667",
    firstCard: String.fromCodePoint(0x1f0d1),
    lastCard: String.fromCodePoint(0x1f0de),
    
  }),
  caption: {
    tarot: "staves",
    singular: "club",
    plural: "clubs",
    toString() {
      return this.singular;
    }
  }
})

export const HEART = Object.freeze({
  icon: new IconOptions({
    solid: "\u2665",
    outline: "\u2661",
    firstCard: String.fromCodePoint(0x1f0b1),
    lastCard: String.fromCodePoint(0x1f0be),
  }),
  caption: {
    tarot: "cups",
    singular: "heart",
    plural: "hearts",
    toString() {
      return this.singular;
    }
  }
})

export const DIAMOND = Object.freeze({
  icon: new IconOptions({
    solid: "\u2666",
    outline: "\u2662",
    firstCard: String.fromCodePoint(0x1f0c1),
    lastCard: String.fromCodePoint(0x1f0ce),
  }),
  caption: {
    tarot: "coins",
    singular: "diamond",
    plural: "diamonds",
    toString() {
      return this.singular;
    }
  }
})

export const SUITES = Object.freeze(
  [SPADE, HEART, DIAMOND, CLUB]
)

export const VALUES = Object.freeze(
  [
  {
    caption: {
      short: "A",
      singular: "ace",
      tarot: "one",
      toString() {
        return this.singular
      }
    },
    value: 1
  },
  {
    caption: {
      singular: "two",
      short: "2",
      tarot: "two",
      toString() {
        return this.singular
      }
    },
    value: 2
  },
  {
    caption: {
      singular: "three",
      tarot: "three",
      toString() {
        return this.singular
      }
    },
    value: 3
  },
  {
    caption: {
      singular: "four",
      tarot: "four",
      toString() {
        return this.singular
      }
    },
    value: 4
  },
  {
    caption: {
      singular: "five",
      tarot: "five",
      toString() {
        return this.singular
      }
    },
    value: 5
  },
  {
    caption: {
      singular: "six",
      tarot: "six",
      toString() {
        return this.singular
      }
    },
    value: 6
  },
  {
    caption: {
      singular: "seven",
      tarot: "seven",
      toString() {
        return this.singular
      }
    },
    value: 7
  },
  {
    caption: {
      singular: "eight",
      tarot: "eight",
      toString() {
        return this.singular
      }
    },
    value: 8
  },
  {
    caption: {
      singular: "nine",
      tarot: "nine",
      toString() {
        return this.singular
      }
    },
    value: 9
  },
  {
    caption: {
      singular: "ten",
      tarot: "ten",
      toString() {
        return this.singular
      }
    },
    value: 10
  }, {
    caption: {
      singular: "jack",
      short: "J",
      tarot: "Jack",
      toString() {
        return this.singular
      }
    },
    value: 11
  },
  {
    caption: {
      singular: "cavalier",
      tarot: "knight",
      short: "C",
      toString() {
        return this.singular
      }
    },
    value: 12
  },
  {
    caption: {
      singular: "queen",
      tarot: "queen",
      short: "Q",
      toString() {
        return this.singular
      }
    },
    value: 13
  },
  {
    caption: {
      singular: "king",
      tarot: "king",
      short: "K",
      toString() {
        return this.singular
      }
    },
    value: 14
  }]
)

export function equalCaption(value, caption, options={}) {
  return (options.tarot && value === caption.tarot) || (caption.short && caption.short === value) ||
  (caption.singular === value) ||
  (caption.plural && caption.plural === value)
}

export class Suite {
  static from(suite, options = {}) {
    if (typeof suite === "string") {
      const result = SUITES.find(
        s => (s.caption.short === suite) || (options.tarot && s.caption.tarot === suite) || (s.plural === suite) || (s.icon.solid === suite) || (s.icon.outline === suite) ||
        (options.card && options.firstCard <= suite && suite <= options.lastCard)
      );
      if (options.strict && suite == null) throw new SyntaxError("Invalid suite")
      return result;
    } else if (suite == null) {
      return TRUMP;
    } else {
      const result = SUITES.find(s => s === suite);
      if (options.strict && suite == null) throw new SyntaxError("Invalid suite")
      return result;
    }
  }
  #values;
  #suite;
  /**
   * @param {Suite|ISuite}
   */
  constructor(suite, options={}) {
    this.#values = options.values?.map( c => {
      const index = suite.icon.cards.indexOf(c);
      return VALUES[index];
    }
    ) ?? VALUES;
    this.#suite = suite;
  }
  get values() {
    return this.#values;
  }
  get caption() {
    return this.#suite.caption;
  }
  /**
   * @override
   * @param {string} card
   * @returns {Card}
   */
   /**
    * @overridw
    * @param {number} value
    * @returns {Card}
    */
    getCard(valueOrCard) {
      if (this.hasCard(valueOrCard)) {
        return new Card({suite: this, value:
        this.getValues(valueOrCard)})
      }
    }
  hasCard(valueOrCard) {
    switch (typeof valueOrCard) {
      case "number":
        return this.values.find(
          s => s.value === valueOrCard) !== underined;
      case "string":
        return this.values.find(
          s => equalCaption(valueOrCard, s.caption, this.options)
        ) !== undefined ||
        this.icon.cards?.find(
          c => c === valueOrCard
        ) !== undefined;
      case "object":
        if (valueOrCard instanceof Card) {
          return valueOrCard.suite === this &&
          this.values.find(
            c => c === valueOrCard.value || c.value === valueOrCard.value.value
          ) != null
        }
      default:
        return false;
    }
  }
  getValue(valueOrCard) {
    switch (typeof valueOrCard) {
      case "number":
        return this.values.find(
          s => s.value === valueOrCard);
      case "string":
        return this.values.find(
          s => equalCaption(valueOrCard, s.caption, this.options)
        ) ??
        this.icon.cards?.find(
          c => c === valueOrCard
        );
      default:
        return undefined;
    }
  }
}

export class Value {
  
  static from(valueCaption) {
    if (typeof valueCaption === "number") {
      const result = VALUES.find(
        c => c.value === valueCaption
      );
      return result;
    } else {
      const result = VALUES.find(
  c => equalCaption(c.caption, valueCaption, options)
);
      return result;
    }
  }

}

export class Card {
  
  #suite;
  #value;
  
  constructor(init) {
    this.#suite = init.suite;
    this.#value = init.value;
    if (!this.#suite.hasCard(this.#value)) {
      throw new SyntaxError("Invalid value for the suite");
    }
  }
  get suite() {
    return this.#suite
  }
  get value() {
    return this.#value
  }
  
  compareTo(other, options = undefined) {
    const suiteOrder = (options?.suiteOrder ?? this.options.suiteOrder);
    let result = 0;
    if (suiteOrder) {
      result = suiteOrder(this.suite, other.suite);
    }
    if (result === 0) {
      const valueOrder = (options?.valueOrder ?? this.options.valueOrder)??(
        (compared, comparee) => {
          const comparedKey = compared.value, compareeKey = comparee.value;
          if (comparedKey === compareeKey) return 0
          if (comparedKey < compareeKey) return -1;
          if (comparedKey > compareeKey) return 1;
          throw new SyntaxError("Cannot compare card values");
        }
      );
      result = valueOrder(compared.value, comparee.value);
    }
    return result;
  }
}

export function CardOfSuite(suite, value, options = {}) {
  const result = {
    suite: Suite.from(suite, options),
    value: Value.from(value, options)
  }
  return new Card(result);
}