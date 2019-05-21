import fs from 'fs-extra';
import path from 'path';

export function getBufferFixture(name: string) {
  return fs.readFileSync(path.join(__dirname, `fixtures/${name}.png`));
}

export function getBase64Fixture(name: string) {
  return getBufferFixture(name).toString('base64');
}

// Generated with http://png-pixel.com/.
export const blackPixelB64 = getBase64Fixture('black-pixel');
export const blackPixelBuffer = getBufferFixture('black-pixel');
export const whitePixelBuffer = getBufferFixture('white-pixel');
export const redPixelBuffer = getBufferFixture('red-pixel');
export const blackSquare100x100Buffer = getBufferFixture('black-square-100x100');
export const blackSquare50x50Buffer = getBufferFixture('black-square-50x50');
export const blackSquare100x50Buffer = getBufferFixture('black-square-100x50');
export const blackSquare50x100Buffer = getBufferFixture('black-square-50x100');
export const whiteSquare100x100Buffer = getBufferFixture('white-square-100x100');
export const diffBlackSquare100x100BlackSquare50x50Buffer = getBufferFixture('diff-100x100-50x50');
export const diffBlackSquare100x100BlackSquare100x50Buffer = getBufferFixture('diff-100x100-100x50');
export const diffBlackSquare100x100BlackSquare50x100Buffer = getBufferFixture('diff-100x100-50x100');
export const redSquare100x100Buffer = getBufferFixture('red-square-100x100');

// Generated from rgby.html and compressed using https://tinypng.com/.
export const rgbySquare100x100Buffer = getBufferFixture('rgby-square-100x100');
export const redSquare50x50Buffer = getBufferFixture('red-square-50x50');
export const greenSquare50x50Buffer = getBufferFixture('green-square-50x50');
export const blueSquare50x50Buffer = getBufferFixture('blue-square-50x50');
export const yellowSquare50x50Buffer = getBufferFixture('yellow-square-50x50');
export const rgbySquare50x50Buffer = getBufferFixture('rgby-square-50x50');
