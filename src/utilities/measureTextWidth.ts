// only create once to improve performance
const div = document.createElement('div');

// prevent div from affecting the positioning of other elements
div.style.position = 'absolute';

// make invisible
div.style.visibility = 'hidden';

// in case the text to be measured is longer than the window width
div.style.whiteSpace = 'nowrap';

// in case is not zero by default
div.style.padding = '0px';

// necessary for measurements to be made
document.body.appendChild(div);

export type Args = {
  /**
   * The text whose width when rendered is to be measured.
   */
  text: string;

  /**
   * The font family that the text is to be rendered in.
   */
  fontFamily: string;

  /**
   * The font size that the text is to be rendered at.
   */
  fontSize: string;

  /**
   * The font weight that the text is to be rendered with.
   */
  fontWeight: string;
};

/**
 * Calculates the width that the text would have when rendered.
 *
 * Returns the width in pixels.
 *
 * Font properties input to this function should be directly assignable
 * to the style object of an element.
 *
 * Uses a DOM-based approach to measure the width of text, which makes
 * this function difficult to unit test on Node.js.
 *
 * (This function always seems to return zero on Node.js.)
 */
export function measureTextWidth(args: Args): number {
  let { text, fontFamily, fontSize, fontWeight } = args;

  div.style.fontFamily = fontFamily;
  div.style.fontSize = fontSize;
  div.style.fontWeight = fontWeight;
  div.textContent = text;

  return div.getBoundingClientRect().width;
}
