/* eslint-disable semi */
export default interface PNGProcessor {
  crop: (img: Buffer, x: number, y: number, w: number, h: number) => Promise<Buffer>;
  setColor: (img: Buffer, x: number, y: number, w: number, h: number, c: string) => Promise<Buffer>;
}
