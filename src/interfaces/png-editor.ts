/* eslint-disable semi */
export default interface PNGEditor {
  compare: (base: Buffer, screenshot: Buffer) => Promise<boolean>;
}
