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
