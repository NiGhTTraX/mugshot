import { MugshotMissingBaselineError, MugshotResult } from '../../src/mugshot';
import { Mock, Times } from 'typemoq';
import { AssertionError, expect } from 'chai';
import PNGDiffer, { DiffResult } from '../../src/interfaces/png-differ';
import Browser, { ElementSelector } from '../../src/interfaces/browser';
import FileSystem from '../../src/interfaces/file-system';

export const fsMock = Mock.ofType<FileSystem>();
export const browserMock = Mock.ofType<Browser>();
export const pngDifferMock = Mock.ofType<PNGDiffer>();

export function setupFsWithExistingBaseline(path: string, base: Buffer) {
  fsMock
    .setup(f => f.pathExists(path))
    .returns(() => Promise.resolve(true))
    .verifiable();
  fsMock
    .setup(f => f.readFile(path))
    .returns(() => Promise.resolve(base))
    .verifiable();
}

export function setupFsWithMissingBaseline(path: string) {
  fsMock
    .setup(f => f.pathExists(path))
    .returns(() => Promise.resolve(false))
    .verifiable();
  fsMock
    .setup(f => f.readFile(path))
    .verifiable(Times.never());
}

export function setupBrowserWithScreenshot(base64: string): void;
export function setupBrowserWithScreenshot(base64: string, selector: ElementSelector): void;
export function setupBrowserWithScreenshot(base64: string, selector?: ElementSelector) {
  browserMock
    .setup(b => (selector ? b.takeElementScreenshot(selector) : b.takeScreenshot()))
    .returns(() => Promise.resolve(base64))
    .verifiable();
}

export function setupDifferWithResult(base: Buffer, screenshot: Buffer, result: DiffResult) {
  pngDifferMock
    .setup(e => e.compare(base, screenshot))
    .returns(() => Promise.resolve(result))
    .verifiable();
}

export async function expectIdenticalResult(
  checkCall: Promise<MugshotResult>,
  baselinePath: string,
  baseline: Buffer
) {
  const result = await checkCall;

  expect(result.matches).to.be.true;
  expect(result.baselinePath).to.equal(baselinePath);
  expect(result.baseline).to.deep.equal(baseline);
}

export async function expectDiffResult(
  checkCall: Promise<MugshotResult>,
  diffPath: string,
  diff: Buffer,
  actualPath: string,
  actual: Buffer
) {
  const result = await checkCall;

  if (!result.matches) {
    expect(result.diffPath).to.equal(diffPath);
    expect(result.diff).to.deep.equal(diff);
    expect(result.actualPath).to.equal(actualPath);
    expect(result.actual).to.deep.equal(actual);
  } else {
    throw new AssertionError('Expected Mugshot to return a diff result');
  }
}

export async function expectError<E extends Error>(
  checkCall: Promise<MugshotResult>,
  expectedError: new (...args: any) => E,
  runExpectations: (error: E) => void
) {
  let threwExpectedError = 0;

  try {
    await checkCall;
  } catch (error) {
    if (error instanceof expectedError) {
      threwExpectedError = 1;

      runExpectations(error);
    } else {
      throw error;
    }
  }

  if (!threwExpectedError) {
    throw new AssertionError(`Expected Mugshot to throw a ${expectedError.constructor.name} error`);
  }
}

export async function expectMissingBaselineError(
  checkCall: Promise<MugshotResult>
) {
  return expectError(
    checkCall,
    MugshotMissingBaselineError,
    error => {
      expect(error.message).to.contain('Missing baseline');
    }
  );
}
