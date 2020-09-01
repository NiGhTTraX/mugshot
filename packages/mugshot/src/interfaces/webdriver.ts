/* eslint-disable max-classes-per-file */
import { ElementSelector, ElementRect } from '../lib/mugshot';

/**
 * Webdriver compatible client.
 */
export default interface Webdriver {
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
   * If the selector matches more than 1 element then an array
   * of [[ElementRect]] should be returned, otherwise a single [[ElementRect]]
   * should be returned.
   *
   * Should return `null` if the selector doesn't match any element.
   *
   * Should return `0,0,0,0` for every element that is not visible.
   */
  getElementRect: (
    selector: ElementSelector
  ) => Promise<ElementRect | ElementRect[] | null>;

  /**
   * Set the size of the __viewport__ (meaning window minus chrome).
   *
   * This is unlike setWindowRect which doesn't take the chrome into account.
   *
   * @see https://w3c.github.io/webdriver/#set-window-rect
   */
  setViewportSize: (width: number, height: number) => Promise<void>;

  /**
   * Execute a function in the current page context.
   *
   * @param func An asynchronous function returning a promise.
   *   Needs to be serializable.
   * @param args Will be passed to the function.
   *   Needs to be serializable.
   *
   * @see https://w3c.github.io/webdriver/#execute-async-script
   */
  execute: <R, A extends any[]>(
    func: (...args: A) => R,
    ...args: A
  ) => Promise<R>;
}

/**
 * Thrown when the given selector doesn't match anything.
 */
export class ElementNotFoundError extends Error {
  constructor(selector: string) {
    super(`Couldn't find element ${selector}`);
  }
}

/**
 * Thrown when the given selector matches an element that is not visible.
 */
export class ElementNotVisibleError extends Error {
  constructor(selector: string) {
    super(`Element ${selector} is not visible`);
  }
}
