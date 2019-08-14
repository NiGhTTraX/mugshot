import { mkdtemp, readFile, writeFile } from 'fs-extra';
import path from 'path';
import { expect } from 'tdd-buffet/suite/expect';
import { beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { blackPixelBuffer, whitePixelBuffer } from '../../../../../../tests/node/fixtures';
import FsStorage from '../../../../src/lib/fs-storage';

describe('FileStorage', () => {
  let tmpPath!: string;

  beforeEach(async () => {
    tmpPath = await mkdtemp('/tmp/mugshot');
  });

  it('should return an existing baseline', async () => {
    const filePath = path.join(tmpPath, 'existing.png');
    await writeFile(filePath, blackPixelBuffer);

    const storage = new FsStorage(tmpPath);
    expect(await storage.readFile('existing')).to.deep.equal(blackPixelBuffer);
  });

  it('should ask if a baseline exists', async () => {
    const existingPath = path.join(tmpPath, 'existing.png');
    await writeFile(existingPath, blackPixelBuffer);

    const storage = new FsStorage(tmpPath);

    expect(await storage.pathExists('existing')).to.be.true;
    expect(await storage.pathExists('missing')).to.be.false;
  });

  it('should write a new baseline', async () => {
    const filePath = path.join(tmpPath, 'new.png');

    const storage = new FsStorage(tmpPath);

    await storage.outputFile('new', blackPixelBuffer);
    expect(await readFile(filePath)).to.deep.equal(blackPixelBuffer);
  });

  it('should update an existing baseline', async () => {
    const filePath = path.join(tmpPath, 'update.png');
    await writeFile(filePath, blackPixelBuffer);

    const storage = new FsStorage(tmpPath);
    await storage.outputFile('update', whitePixelBuffer);

    expect(await readFile(filePath)).to.deep.equal(whitePixelBuffer);
  });
});
