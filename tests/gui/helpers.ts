import fs from 'fs-extra';
import path from 'path';

export async function getFixture(name: string) {
  return fs.readFile(path.join(__dirname, `fixtures/${name}.html`), {
    encoding: 'utf8',
  });
}
