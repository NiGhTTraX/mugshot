export type DiffResult = {
  matches: true
} | {
  matches: false;
  diff: Buffer;
};

/* eslint-disable semi */
export default interface PNGEditor {
  compare: (base: Buffer, screenshot: Buffer) => Promise<DiffResult>;
}
