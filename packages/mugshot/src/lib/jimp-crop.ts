/* eslint-disable */
import Jimp from 'jimp';
// @ts-ignore because no type defs
import { isNodePattern } from '@jimp/utils';

type ImageCallback<U = any> = (
  this: Jimp,
  err: Error | null,
  value: Jimp
) => U;

type JimpPlugin = (name: string, func: (this: Jimp, ...args: any[]) => Jimp) => void;

/**
 * TODO: get rid of this after https://github.com/oliver-moran/jimp/pull/741
 * is merged.
 */
export default function pluginCrop(event: JimpPlugin) {
  event('crop', function crop(
    x: number, y: number, w: number, h: number,
    cb?: ImageCallback
  ) {
    // round input
    x = Math.round(x);
    y = Math.round(y);
    w = Math.round(w);
    h = Math.round(h);

    if (x === 0 && w === this.bitmap.width) {
      // shortcut
      const start = (w * y + x) << 2;
      const end = (start + h * w) << 2;

      this.bitmap.data = this.bitmap.data.slice(start, end);
    } else {
      const bitmap = Buffer.allocUnsafe(w * h * 4);
      let offset = 0;

      this.scanQuiet(x, y, w, h, function(x, y, idx) {
        const data = this.bitmap.data.readUInt32BE(idx, true);
        bitmap.writeUInt32BE(data, offset, true);
        offset += 4;
      });

      this.bitmap.data = bitmap;
    }

    this.bitmap.width = w;
    this.bitmap.height = h;

    if (isNodePattern(cb)) {
      // @ts-ignore because cb can be undefined and isNodePattern doesn't narrow
      cb.call(this, null, this);
    }

    return this;
  });
}
