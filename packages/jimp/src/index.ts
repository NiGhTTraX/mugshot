import configure from '@jimp/custom';
import '@jimp/core';
import png from '@jimp/png';
import color from '@jimp/plugin-color';
import crop from '@jimp/plugin-crop';

export const Jimp = configure({
  types: [png],
  plugins: [color, crop],
});
