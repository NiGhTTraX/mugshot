import Mock, { It } from 'strong-mock';
import { expect } from 'tdd-buffet/expect/jest';
import { afterEach, beforeEach, describe, it } from 'tdd-buffet/suite/node';
import {
  blackPixelB64,
  blackPixelBuffer,
  redPixelBuffer,
  whitePixelBuffer
} from '../../../../../tests/node/fixtures';
import { expectIdenticalBuffers } from '../../../../../tests/node/suite';
import Browser from '../../../src/interfaces/browser';
import PNGProcessor from '../../../src/interfaces/png-processor';
import { TooManyElementsError } from '../../../src/interfaces/screenshotter';
import BrowserScreenshotter from '../../../src/lib/browser-screenshotter';

describe('BrowserScreenshotter', () => {
  const browser = new Mock<Browser>();
  const pngProcessor = new Mock<PNGProcessor>();

  beforeEach(() => {
    browser.reset();
    pngProcessor.reset();
  });

  afterEach(() => {
    browser.verifyAll();
    pngProcessor.verifyAll();
  });

  it('should take a screenshot of the viewport', async () => {
    browser.when(b => b.takeScreenshot()).resolves(blackPixelB64);

    const screenshotter = new BrowserScreenshotter(browser.stub);

    const screenshot = await screenshotter.takeScreenshot();

    await expectIdenticalBuffers(screenshot, blackPixelBuffer);
  });

  it('should take a screenshot of an element', async () => {
    browser.when(b => b.takeScreenshot()).resolves(blackPixelB64);
    browser
      .when(b => b.getElementRect('.test'))
      .resolves({ x: 1, y: 2, width: 3, height: 4 });

    pngProcessor
      .when(p => p.crop(blackPixelBuffer, 1, 2, 3, 4))
      .resolves(whitePixelBuffer);

    const screenshotter = new BrowserScreenshotter(browser.stub, {
      pngProcessor: pngProcessor.stub
    });

    const screenshot = await screenshotter.takeScreenshot('.test');

    await expectIdenticalBuffers(screenshot, whitePixelBuffer);
  });

  it('should throw if the selector returns multiple elements', async () => {
    browser.when(b => b.takeScreenshot()).resolves(blackPixelB64);
    browser
      .when(b => b.getElementRect('.test'))
      .returns(
        Promise.resolve([
          { x: 1, y: 2, width: 3, height: 4 },
          { x: 5, y: 6, width: 7, height: 8 }
        ])
      );

    const screenshotter = new BrowserScreenshotter(browser.stub, {
      pngProcessor: pngProcessor.stub
    });

    expect(screenshotter.takeScreenshot('.test')).rejects.toBeInstanceOf(
      TooManyElementsError
    );
  });

  it('should take a screenshot of the viewport and ignore an element', async () => {
    browser.when(b => b.takeScreenshot()).resolves(blackPixelB64);
    browser
      .when(b => b.getElementRect('.ignore'))
      .resolves({ x: 1, y: 2, width: 3, height: 4 });

    pngProcessor
      .when(p => p.paint(blackPixelBuffer, 1, 2, 3, 4, '#000'))
      .resolves(whitePixelBuffer);

    const screenshotter = new BrowserScreenshotter(browser.stub, {
      pngProcessor: pngProcessor.stub
    });

    const screenshot = await screenshotter.takeScreenshot({
      ignore: '.ignore'
    });

    await expectIdenticalBuffers(screenshot, whitePixelBuffer);
  });

  it('should take a screenshot of the viewport and ignore all matching elements', async () => {
    browser.when(b => b.takeScreenshot()).resolves(blackPixelB64);
    browser
      .when(b => b.getElementRect('.ignore'))
      .returns(
        Promise.resolve([
          { x: 1, y: 2, width: 3, height: 4 },
          { x: 10, y: 20, width: 30, height: 40 }
        ])
      );

    pngProcessor
      .when(p => p.paint(blackPixelBuffer, 1, 2, 3, 4, '#000'))
      .resolves(whitePixelBuffer);
    pngProcessor
      .when(p => p.paint(whitePixelBuffer, 10, 20, 30, 40, '#000'))
      .resolves(blackPixelBuffer);

    const screenshotter = new BrowserScreenshotter(browser.stub, {
      pngProcessor: pngProcessor.stub
    });

    const screenshot = await screenshotter.takeScreenshot({
      ignore: '.ignore'
    });

    await expectIdenticalBuffers(screenshot, blackPixelBuffer);
  });

  it('should take a screenshot of an element and ignore an element', async () => {
    browser.when(b => b.takeScreenshot()).resolves(blackPixelB64);
    browser
      .when(b => b.getElementRect('.test'))
      .resolves({ x: 0, y: 0, width: 10, height: 10 });
    browser
      .when(b => b.getElementRect('.ignore'))
      .resolves({ x: 1, y: 1, width: 4, height: 4 });

    pngProcessor
      .when(p => p.crop(blackPixelBuffer, 0, 0, 10, 10))
      .resolves(whitePixelBuffer);
    pngProcessor
      .when(p => p.paint(whitePixelBuffer, 1, 1, 4, 4, '#000'))
      .resolves(redPixelBuffer);

    const screenshotter = new BrowserScreenshotter(browser.stub, {
      pngProcessor: pngProcessor.stub
    });

    const screenshot = await screenshotter.takeScreenshot('.test', {
      ignore: '.ignore'
    });

    await expectIdenticalBuffers(screenshot, redPixelBuffer);
  });

  it('should take a screenshot of an element and ignore all matching elements', async () => {
    browser.when(b => b.takeScreenshot()).resolves(blackPixelB64);
    browser
      .when(b => b.getElementRect('.test'))
      .resolves({ x: 0, y: 0, width: 10, height: 10 });
    browser
      .when(b => b.getElementRect('.ignore'))
      .returns(
        Promise.resolve([
          { x: 1, y: 2, width: 3, height: 4 },
          { x: 5, y: 6, width: 7, height: 8 }
        ])
      );

    pngProcessor
      .when(p => p.crop(blackPixelBuffer, 0, 0, 10, 10))
      .resolves(whitePixelBuffer);
    pngProcessor
      .when(p => p.paint(whitePixelBuffer, 1, 2, 3, 4, '#000'))
      .resolves(redPixelBuffer);
    pngProcessor
      .when(p => p.paint(redPixelBuffer, 5, 6, 7, 8, '#000'))
      .resolves(blackPixelBuffer);

    const screenshotter = new BrowserScreenshotter(browser.stub, {
      pngProcessor: pngProcessor.stub
    });

    const screenshot = await screenshotter.takeScreenshot('.test', {
      ignore: '.ignore'
    });

    await expectIdenticalBuffers(screenshot, blackPixelBuffer);
  });

  it('should disable animations', async () => {
    browser.when(b => b.takeScreenshot()).resolves(blackPixelB64);
    browser.when(b => b.execute(It.isAny)).resolves(undefined);

    const screenshotter = new BrowserScreenshotter(browser.stub, {
      pngProcessor: pngProcessor.stub,
      disableAnimations: true
    });

    const screenshot = await screenshotter.takeScreenshot();

    await expectIdenticalBuffers(screenshot, blackPixelBuffer);
  });
});
