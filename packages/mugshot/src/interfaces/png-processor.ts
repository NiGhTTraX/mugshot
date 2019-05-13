/* eslint-disable semi */
export default interface PNGProcessor {
  crop: (img: Buffer, x: number, y: number, w: number, h: number) => Promise<Buffer>;
}
