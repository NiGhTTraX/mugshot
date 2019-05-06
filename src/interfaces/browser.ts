export type ElementSelector = string;

/* eslint-disable semi */
export default interface Browser {
  // Take a full page screenshot and return a base64 string.
  // https://w3c.github.io/webdriver/#take-screenshot
  takeScreenshot: () => Promise<string>;

  // Take a screenshot of the visible region encompassed by the bounding
  // rectangle of an element.
  // https://w3c.github.io/webdriver/#dfn-take-element-screenshot
  takeElementScreenshot: (selector: ElementSelector) => Promise<string>;
}
