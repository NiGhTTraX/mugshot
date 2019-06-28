import {
  afterEach,
  beforeEach,
  describe,
  expectIdenticalBuffers,
  it
} from '../../../../../tests/node/suite';
import Mock from 'strong-mock';
import Browser from '../../../src/interfaces/browser';
import PNGProcessor from '../../../src/interfaces/png-processor';
import MugshotScreenshotter from '../../../src/lib/mugshot-screenshotter';
import {
  blackPixelB64,
  blackPixelBuffer,
  redPixelBuffer,
  whitePixelBuffer
} from '../../../../../tests/node/fixtures';

describe('Screenshotter', () => {
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

    const screenshotter = new MugshotScreenshotter(
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

    const screenshotter = new MugshotScreenshotter(
      browser.stub,
      pngProcessor.stub
    );

    const screenshot = await screenshotter.takeScreenshot('.test');

    await expectIdenticalBuffers(screenshot, whitePixelBuffer);
  });

  it('should take a screenshot of the viewport and ignore elements', async () => {
    browser
      .when(b => b.takeScreenshot())
      .returns(Promise.resolve(blackPixelB64));
    browser
      .when(b => b.getElementRect('.ignore'))
      .returns(Promise.resolve({ x: 1, y: 2, width: 3, height: 4 }));

    pngProcessor
      .when(p => p.paint(blackPixelBuffer, 1, 2, 3, 4, '#000'))
      .returns(Promise.resolve(whitePixelBuffer));

    const screenshotter = new MugshotScreenshotter(
      browser.stub,
      pngProcessor.stub
    );

    const screenshot = await screenshotter.takeScreenshot({ ignore: '.ignore' });

    await expectIdenticalBuffers(screenshot, whitePixelBuffer);
  });

  it('should take a screenshot of an element and ignore elements', async () => {
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

    const screenshotter = new MugshotScreenshotter(
      browser.stub,
      pngProcessor.stub
    );

    const screenshot = await screenshotter.takeScreenshot('.test', { ignore: '.ignore' });

    await expectIdenticalBuffers(screenshot, redPixelBuffer);
  });
});
