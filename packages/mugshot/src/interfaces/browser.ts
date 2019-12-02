/* eslint-disable semi */
export type ElementRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default interface Browser {
  /**
   * Take a viewport screenshot and return a base64 string.
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
  getElementRect: (selector: string) => Promise<ElementRect | ElementRect[]>;

  /**
   * Set the size of the __viewport__ (meaning window minus chrome).
   *
   * This is unlike setWindowRect which doesn't take the chrome into account.
   *
   * @see https://w3c.github.io/webdriver/#set-window-rect
   */
  setViewportSize: (width: number, height: number) => Promise<void>;
}

/* istanbul ignore next because the adapter packages are supposed to throw it */
export class ElementNotFound extends Error {
  constructor(selector: string) {
    super(`Couldn't find element ${selector}`);
  }
}
