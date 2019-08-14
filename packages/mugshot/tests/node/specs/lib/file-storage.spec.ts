import { mkdtemp, writeFile } from 'fs-extra';
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
    const filePath = path.join(tmpPath, 'existing');
    await writeFile(filePath, blackPixelBuffer);

    const storage = new FsStorage();
    expect(await storage.readFile(filePath)).to.deep.equal(blackPixelBuffer);
  });
  it('should ask if a baseline exists', async () => {
    const existingPath = path.join(tmpPath, 'existing');
    const missingPath = path.join(tmpPath, 'missing');
    await writeFile(existingPath, blackPixelBuffer);

    const storage = new FsStorage();
    expect(await storage.pathExists(existingPath)).to.be.true;
    expect(await storage.pathExists(missingPath)).to.be.false;
  });

  it('should write a new baseline', async () => {
    const filePath = path.join(tmpPath, 'new');

    const storage = new FsStorage();
    await storage.outputFile(filePath, blackPixelBuffer);
    expect(await storage.readFile(filePath)).to.deep.equal(blackPixelBuffer);
  });

  it('should update an existing baseline', async () => {
    const filePath = path.join(tmpPath, 'new');
    await writeFile(filePath, blackPixelBuffer);

    const storage = new FsStorage();
    await storage.outputFile(filePath, whitePixelBuffer);
    expect(await storage.readFile(filePath)).to.deep.equal(whitePixelBuffer);
  });
});
