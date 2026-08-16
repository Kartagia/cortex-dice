
/**
 * @module model/cards-shared
 */
 
/**
 * @typedef IconDeclaration
 * @property {string} solid The solid icon glyph or URL.
 * @property {string} [tarot] The tarot icon glyph or URL.
 * @property {string} [outline] The outline icon glyph or URL.
 */
/**
 * A suite icon declaration.
 * @typedef SuiteCardIconDeclaration
 * @property {string} firstCard The first card glyph.
 * @property {string} lastCard The last card glyph.
 * @property {Iterable<string>} cards The iterable glyphs of the suite cards.
 */
 /**
  * @typedef {Omit<SuiteCardIconDeclaration, "cards">} SuiteCardIconRangeDeclaration
  */
  /**
   * @typedef {Pick<SuiteCardIconDeclaration, "cards">} SuiteCardIconArrayDeclaration
   */
 
/**
 * The icon options.
 * @constructor IconOptions
 * @param {IconDeclaration | IconDeclaration & (SuiteCardIconDeclaration|SuiteCardIconArrayDeclaration|SuiteCardIconRangeDeclaration) } props
 */
export function IconOptions(props) {
  
  this.solid = props.solid;
  if (props.outline)
    /**
     * The outline icon.
     */
    this.outline = props.outline;
  if (props.tarot)
    this.tarot = props.tarot;
  if (props.cards) {
    this.cards = Object.freeze([...props.cards]);
    if (props.firstCard && props.firstCard !== this.cards[0]) throw new SyntaxError("Invalid first card")
    if (props.lastCard && props.lastCard !== this.cards[this.cards.length-1]) throw new SyntaxError("Invalid last card")
    
    
    if (props.firstCard) this.firstCard = this.cards[0];
    if (props.lastCard) this.lastCard = this.cards[this.cards.length-1]
  } else if (props.firstCard || props.lastCard) {
    if (!props.firstCard) throw new SyntaxError("Missing first card");
    if (!props.lastCard) throw new SyntaxError("Missing last card");
    this.firstCard = props.firstCard;
    this.lastCard = props.lastCard;
    const cards = [];
    if (this.firstCard === String.fromCodePoint(this.firstCard.codePointAt(0)??0) && this.lastCard === String.fromCodePoint(this.lastCard.codePointAt(0) ?? 0)) {
      // Both cards are code point glyphs
    for (let c = this.firstCard; c <= this.lastCard; c = String.fromCodePoint(c.codePointAt(0) +1)) {
      cards.push(c)
    }
    } else if (this.firstCard === this.lastCard) {
      cards.push(this.lastCard);
    } else {
      cards.push(this.firstCard, this.lastCard)
    }
    this.cards = Object.freeze(cards);
  }
  this.toString = () => {
    return this.solid;
  }
}
