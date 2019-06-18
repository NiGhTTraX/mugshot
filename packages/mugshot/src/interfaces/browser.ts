/* eslint-disable semi */
export type ElementRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default interface Browser {
  /**
   * Take a full page screenshot and return a base64 string.
   *
   * @see https://w3c.github.io/webdriver/#take-screenshot
   */
  takeScreenshot: () => Promise<string>;

  /**
   * Get the dimensions and coordinates of an element.
   *
   * @see https://w3c.github.io/webdriver/#get-element-rect
   *
   * Should throw `ElementNotFound` if the element is not found.
   */
  getElementRect: (selector: string) => Promise<ElementRect>;
}

export class ElementNotFound extends Error {
  constructor(selector: string) {
    super(`Couldn't find element ${selector}`);

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, ElementNotFound.prototype);
  }
}
