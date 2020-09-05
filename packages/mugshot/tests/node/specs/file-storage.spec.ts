import { mkdtemp, readFile, writeFile, pathExists } from 'fs-extra';
import path from 'path';
import { expect } from 'tdd-buffet/expect/chai';
import { beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { blackPixelBuffer, whitePixelBuffer } from '../fixtures';
import FsStorage from '../../../src/lib/fs-storage';

describe('FileStorage', () => {
  let tmpPath!: string;

  beforeEach(async () => {
    tmpPath = await mkdtemp('/tmp/mugshot');
  });

  it('should return an existing screenshot', async () => {
    const filePath = path.join(tmpPath, 'existing.png');
    await writeFile(filePath, blackPixelBuffer);

    const storage = new FsStorage(tmpPath);
    expect(await storage.read('existing')).to.deep.equal(blackPixelBuffer);
  });

  it('should ask if a screenshot exists', async () => {
    const existingPath = path.join(tmpPath, 'existing.png');
    await writeFile(existingPath, blackPixelBuffer);

    const storage = new FsStorage(tmpPath);

    expect(await storage.exists('existing')).to.be.true;
    expect(await storage.exists('missing')).to.be.false;
  });

  it('should write a new screenshot', async () => {
    const filePath = path.join(tmpPath, 'new.png');

    const storage = new FsStorage(tmpPath);

    await storage.write('new', blackPixelBuffer);
    expect(await readFile(filePath)).to.deep.equal(blackPixelBuffer);
  });

  it('should create the parent folder structure', async () => {
    const deepPath = path.join(tmpPath, 'foo', 'bar', 'baz');
    const filePath = path.join(deepPath, 'new.png');

    const storage = new FsStorage(deepPath);

    await storage.write('new', blackPixelBuffer);
    expect(await readFile(filePath)).to.deep.equal(blackPixelBuffer);
  });

  it('should update an existing screenshot', async () => {
    const filePath = path.join(tmpPath, 'update.png');
    await writeFile(filePath, blackPixelBuffer);

    const storage = new FsStorage(tmpPath);
    await storage.write('update', whitePixelBuffer);

    expect(await readFile(filePath)).to.deep.equal(whitePixelBuffer);
  });

  it('should delete an existing screenshot', async () => {
    const filePath = path.join(tmpPath, 'delete.png');
    await writeFile(filePath, blackPixelBuffer);

    const storage = new FsStorage(tmpPath);
    await storage.delete('delete');

    expect(await pathExists(filePath)).to.be.false;
  });

  it('should delete an non existing screenshot', async () => {
    const filePath = path.join(tmpPath, 'missing.png');

    const storage = new FsStorage(tmpPath);
    await storage.delete('missing');

    expect(await pathExists(filePath)).to.be.false;
  });
});
