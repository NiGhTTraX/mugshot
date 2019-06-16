/* eslint-disable semi */
export type ElementRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default interface Browser {
  // Take a full page screenshot and return a base64 string.
  // https://w3c.github.io/webdriver/#take-screenshot
  takeScreenshot: () => Promise<string>;

  // Get the dimensions and coordinates of an element.
  // https://w3c.github.io/webdriver/#get-element-rect
  getElementRect: (selector: string) => Promise<ElementRect>;
}
