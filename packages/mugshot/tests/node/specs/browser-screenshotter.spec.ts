import Mock from 'strong-mock';
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
    browser
      .when(b => b.takeScreenshot())
      .returns(Promise.resolve(blackPixelB64));

    const screenshotter = new BrowserScreenshotter(
      browser.stub,
      pngProcessor.stub
    );

    const screenshot = await screenshotter.takeScreenshot();

    await expectIdenticalBuffers(screenshot, blackPixelBuffer);
  });

  it('should take a screenshot of an element', async () => {
    browser
      .when(b => b.takeScreenshot())
      .returns(Promise.resolve(blackPixelB64));
    browser
      .when(b => b.getElementRect('.test'))
      .returns(Promise.resolve({ x: 1, y: 2, width: 3, height: 4 }));

    pngProcessor
      .when(p => p.crop(blackPixelBuffer, 1, 2, 3, 4))
      .returns(Promise.resolve(whitePixelBuffer));

    const screenshotter = new BrowserScreenshotter(
      browser.stub,
      pngProcessor.stub
    );

    const screenshot = await screenshotter.takeScreenshot('.test');

    await expectIdenticalBuffers(screenshot, whitePixelBuffer);
  });

  it('should take a screenshot of the viewport and ignore an element', async () => {
    browser
      .when(b => b.takeScreenshot())
      .returns(Promise.resolve(blackPixelB64));
    browser
      .when(b => b.getElementRect('.ignore'))
      .returns(Promise.resolve({ x: 1, y: 2, width: 3, height: 4 }));

    pngProcessor
      .when(p => p.paint(blackPixelBuffer, 1, 2, 3, 4, '#000'))
      .returns(Promise.resolve(whitePixelBuffer));

    const screenshotter = new BrowserScreenshotter(
      browser.stub,
      pngProcessor.stub
    );

    const screenshot = await screenshotter.takeScreenshot({
      ignore: '.ignore'
    });

    await expectIdenticalBuffers(screenshot, whitePixelBuffer);
  });

  it('should take a screenshot of the viewport and ignore all matching elements', async () => {
    browser
      .when(b => b.takeScreenshot())
      .returns(Promise.resolve(blackPixelB64));
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
      .returns(Promise.resolve(whitePixelBuffer));
    pngProcessor
      .when(p => p.paint(whitePixelBuffer, 10, 20, 30, 40, '#000'))
      .returns(Promise.resolve(blackPixelBuffer));

    const screenshotter = new BrowserScreenshotter(
      browser.stub,
      pngProcessor.stub
    );

    const screenshot = await screenshotter.takeScreenshot({
      ignore: '.ignore'
    });

    await expectIdenticalBuffers(screenshot, blackPixelBuffer);
  });

  it('should take a screenshot of an element and ignore an element', async () => {
    browser
      .when(b => b.takeScreenshot())
      .returns(Promise.resolve(blackPixelB64));
    browser
      .when(b => b.getElementRect('.test'))
      .returns(Promise.resolve({ x: 0, y: 0, width: 10, height: 10 }));
    browser
      .when(b => b.getElementRect('.ignore'))
      .returns(Promise.resolve({ x: 1, y: 1, width: 4, height: 4 }));

    pngProcessor
      .when(p => p.crop(blackPixelBuffer, 0, 0, 10, 10))
      .returns(Promise.resolve(whitePixelBuffer));
    pngProcessor
      .when(p => p.paint(whitePixelBuffer, 1, 1, 4, 4, '#000'))
      .returns(Promise.resolve(redPixelBuffer));

    const screenshotter = new BrowserScreenshotter(
      browser.stub,
      pngProcessor.stub
    );

    const screenshot = await screenshotter.takeScreenshot('.test', {
      ignore: '.ignore'
    });

    await expectIdenticalBuffers(screenshot, redPixelBuffer);
  });

  it('should take a screenshot of an element and ignore all matching elements', async () => {
    browser
      .when(b => b.takeScreenshot())
      .returns(Promise.resolve(blackPixelB64));
    browser
      .when(b => b.getElementRect('.test'))
      .returns(Promise.resolve({ x: 0, y: 0, width: 10, height: 10 }));
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
      .returns(Promise.resolve(whitePixelBuffer));
    pngProcessor
      .when(p => p.paint(whitePixelBuffer, 1, 2, 3, 4, '#000'))
      .returns(Promise.resolve(redPixelBuffer));
    pngProcessor
      .when(p => p.paint(redPixelBuffer, 5, 6, 7, 8, '#000'))
      .returns(Promise.resolve(blackPixelBuffer));

    const screenshotter = new BrowserScreenshotter(
      browser.stub,
      pngProcessor.stub
    );

    const screenshot = await screenshotter.takeScreenshot('.test', {
      ignore: '.ignore'
    });

    await expectIdenticalBuffers(screenshot, blackPixelBuffer);
  });
});
