import { instance, It, mock, reset, verify, when } from 'strong-mock';
import { expect } from 'tdd-buffet/expect/jest';
import { afterEach, beforeEach, describe, it } from 'tdd-buffet/suite/node';
import {
  blackPixelB64,
  blackPixelBuffer,
  redPixelBuffer,
  whitePixelBuffer,
} from '../../fixtures';
import { expectIdenticalBuffers } from '../../helpers';
import PNGProcessor from '../../../../src/interfaces/png-processor';
import { TooManyElementsError } from '../../../../src/interfaces/screenshotter';
import Webdriver, {
  ElementNotFoundError,
  ElementNotVisibleError,
} from '../../../../src/interfaces/webdriver';
import WebdriverScreenshotter from '../../../../src/lib/webdriver-screenshotter';

describe('WebdriverScreenshotter', () => {
  const client = mock<Webdriver>();
  const pngProcessor = mock<PNGProcessor>();

  beforeEach(() => {
    reset(client);
    reset(pngProcessor);
  });

  afterEach(() => {
    verify(client);
    verify(pngProcessor);
  });

  it('should take a screenshot of the viewport', async () => {
    when(client.takeScreenshot()).thenResolve(blackPixelB64);

    const screenshotter = new WebdriverScreenshotter(instance(client));

    const screenshot = await screenshotter.takeScreenshot();

    await expectIdenticalBuffers(screenshot, blackPixelBuffer);
  });

  it('should take a screenshot of an element', async () => {
    when(client.takeScreenshot()).thenResolve(blackPixelB64);
    when(client.getElementRect('.test')).thenResolve({
      x: 1,
      y: 2,
      width: 3,
      height: 4,
    });

    when(pngProcessor.crop(blackPixelBuffer, 1, 2, 3, 4)).thenResolve(
      whitePixelBuffer
    );

    const screenshotter = new WebdriverScreenshotter(instance(client), {
      pngProcessor: instance(pngProcessor),
    });

    const screenshot = await screenshotter.takeScreenshot('.test');

    await expectIdenticalBuffers(screenshot, whitePixelBuffer);
  });

  it('should take a screenshot of an area', async () => {
    when(client.takeScreenshot()).thenResolve(blackPixelB64);

    when(pngProcessor.crop(blackPixelBuffer, 1, 2, 3, 4)).thenResolve(
      whitePixelBuffer
    );

    const screenshotter = new WebdriverScreenshotter(instance(client), {
      pngProcessor: instance(pngProcessor),
    });

    const screenshot = await screenshotter.takeScreenshot({
      x: 1,
      y: 2,
      width: 3,
      height: 4,
    });

    await expectIdenticalBuffers(screenshot, whitePixelBuffer);
  });

  it('should throw if the selector returns multiple elements', async () => {
    when(client.takeScreenshot()).thenResolve(blackPixelB64);
    when(client.getElementRect('.test')).thenResolve([
      { x: 1, y: 2, width: 3, height: 4 },
      { x: 5, y: 6, width: 7, height: 8 },
    ]);

    const screenshotter = new WebdriverScreenshotter(instance(client), {
      pngProcessor: instance(pngProcessor),
    });

    await expect(screenshotter.takeScreenshot('.test')).rejects.toBeInstanceOf(
      TooManyElementsError
    );
  });

  it('should throw if the element is not found', async () => {
    when(client.takeScreenshot()).thenResolve(blackPixelB64);
    when(client.getElementRect('.test')).thenResolve(null);

    const screenshotter = new WebdriverScreenshotter(instance(client), {
      pngProcessor: instance(pngProcessor),
    });

    await expect(screenshotter.takeScreenshot('.test')).rejects.toBeInstanceOf(
      ElementNotFoundError
    );
  });

  it('should throw if the element has 0 width', async () => {
    when(client.takeScreenshot()).thenResolve(blackPixelB64);
    when(client.getElementRect('.test')).thenResolve({
      width: 0,
      height: 100,
      x: 0,
      y: 0,
    });

    const screenshotter = new WebdriverScreenshotter(instance(client), {
      pngProcessor: instance(pngProcessor),
    });

    await expect(screenshotter.takeScreenshot('.test')).rejects.toBeInstanceOf(
      ElementNotVisibleError
    );
  });

  it('should throw if the element has 0 height', async () => {
    when(client.takeScreenshot()).thenResolve(blackPixelB64);
    when(client.getElementRect('.test')).thenResolve({
      height: 0,
      width: 100,
      x: 0,
      y: 0,
    });

    const screenshotter = new WebdriverScreenshotter(instance(client), {
      pngProcessor: instance(pngProcessor),
    });

    await expect(screenshotter.takeScreenshot('.test')).rejects.toBeInstanceOf(
      ElementNotVisibleError
    );
  });

  it('should take a screenshot of the viewport and ignore an element', async () => {
    when(client.takeScreenshot()).thenResolve(blackPixelB64);
    when(client.getElementRect('.ignore')).thenResolve({
      x: 1,
      y: 2,
      width: 3,
      height: 4,
    });

    when(pngProcessor.paint(blackPixelBuffer, 1, 2, 3, 4, '#000')).thenResolve(
      whitePixelBuffer
    );

    const screenshotter = new WebdriverScreenshotter(instance(client), {
      pngProcessor: instance(pngProcessor),
    });

    const screenshot = await screenshotter.takeScreenshot({
      ignore: '.ignore',
    });

    await expectIdenticalBuffers(screenshot, whitePixelBuffer);
  });

  it('should throw if the ignore selector does not return anything', async () => {
    when(client.takeScreenshot()).thenResolve(blackPixelB64);
    when(client.getElementRect('.ignore')).thenResolve(null);

    const screenshotter = new WebdriverScreenshotter(instance(client), {
      pngProcessor: instance(pngProcessor),
    });

    await expect(
      screenshotter.takeScreenshot({
        ignore: '.ignore',
      })
    ).rejects.toBeInstanceOf(ElementNotFoundError);
  });

  it('should throw if the ignore selector returns 0 width', async () => {
    when(client.takeScreenshot()).thenResolve(blackPixelB64);
    when(client.getElementRect('.ignore')).thenResolve({
      x: 0,
      y: 0,
      width: 0,
      height: 100,
    });

    const screenshotter = new WebdriverScreenshotter(instance(client), {
      pngProcessor: instance(pngProcessor),
    });

    await expect(
      screenshotter.takeScreenshot({
        ignore: '.ignore',
      })
    ).rejects.toBeInstanceOf(ElementNotVisibleError);
  });

  it('should throw if the ignore selector returns 0 height', async () => {
    when(client.takeScreenshot()).thenResolve(blackPixelB64);
    when(client.getElementRect('.ignore')).thenResolve({
      x: 0,
      y: 0,
      width: 100,
      height: 0,
    });

    const screenshotter = new WebdriverScreenshotter(instance(client), {
      pngProcessor: instance(pngProcessor),
    });

    await expect(
      screenshotter.takeScreenshot({
        ignore: '.ignore',
      })
    ).rejects.toBeInstanceOf(ElementNotVisibleError);
  });

  it('should throw if the ignore selector returns multiple elements with one 0 height', async () => {
    when(client.takeScreenshot()).thenResolve(blackPixelB64);
    when(client.getElementRect('.ignore')).thenResolve([
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
      {
        x: 100,
        y: 100,
        width: 100,
        height: 0,
      },
    ]);

    const screenshotter = new WebdriverScreenshotter(instance(client), {
      pngProcessor: instance(pngProcessor),
    });

    await expect(
      screenshotter.takeScreenshot({
        ignore: '.ignore',
      })
    ).rejects.toBeInstanceOf(ElementNotVisibleError);
  });

  it('should take a screenshot of the viewport and ignore an area', async () => {
    when(client.takeScreenshot()).thenResolve(blackPixelB64);

    when(pngProcessor.paint(blackPixelBuffer, 1, 2, 3, 4, '#000')).thenResolve(
      whitePixelBuffer
    );

    const screenshotter = new WebdriverScreenshotter(instance(client), {
      pngProcessor: instance(pngProcessor),
    });

    const screenshot = await screenshotter.takeScreenshot({
      ignore: { x: 1, y: 2, width: 3, height: 4 },
    });

    await expectIdenticalBuffers(screenshot, whitePixelBuffer);
  });

  it('should take a screenshot of the viewport and ignore all matching elements', async () => {
    when(client.takeScreenshot()).thenResolve(blackPixelB64);
    when(client.getElementRect('.ignore')).thenResolve([
      { x: 1, y: 2, width: 3, height: 4 },
      { x: 10, y: 20, width: 30, height: 40 },
    ]);

    when(pngProcessor.paint(blackPixelBuffer, 1, 2, 3, 4, '#000')).thenResolve(
      whitePixelBuffer
    );
    when(
      pngProcessor.paint(whitePixelBuffer, 10, 20, 30, 40, '#000')
    ).thenResolve(blackPixelBuffer);

    const screenshotter = new WebdriverScreenshotter(instance(client), {
      pngProcessor: instance(pngProcessor),
    });

    const screenshot = await screenshotter.takeScreenshot({
      ignore: '.ignore',
    });

    await expectIdenticalBuffers(screenshot, blackPixelBuffer);
  });

  it('should take a screenshot of an element and ignore an element', async () => {
    when(client.takeScreenshot()).thenResolve(blackPixelB64);
    when(client.getElementRect('.test')).thenResolve({
      x: 0,
      y: 0,
      width: 10,
      height: 10,
    });
    when(client.getElementRect('.ignore')).thenResolve({
      x: 1,
      y: 1,
      width: 4,
      height: 4,
    });

    when(pngProcessor.crop(blackPixelBuffer, 0, 0, 10, 10)).thenResolve(
      whitePixelBuffer
    );
    when(pngProcessor.paint(whitePixelBuffer, 1, 1, 4, 4, '#000')).thenResolve(
      redPixelBuffer
    );

    const screenshotter = new WebdriverScreenshotter(instance(client), {
      pngProcessor: instance(pngProcessor),
    });

    const screenshot = await screenshotter.takeScreenshot('.test', {
      ignore: '.ignore',
    });

    await expectIdenticalBuffers(screenshot, redPixelBuffer);
  });

  it('should take a screenshot of an element and ignore an area', async () => {
    when(client.takeScreenshot()).thenResolve(blackPixelB64);
    when(client.getElementRect('.test')).thenResolve({
      x: 0,
      y: 0,
      width: 10,
      height: 10,
    });

    when(pngProcessor.crop(blackPixelBuffer, 0, 0, 10, 10)).thenResolve(
      whitePixelBuffer
    );
    when(pngProcessor.paint(whitePixelBuffer, 1, 2, 3, 4, '#000')).thenResolve(
      redPixelBuffer
    );

    const screenshotter = new WebdriverScreenshotter(instance(client), {
      pngProcessor: instance(pngProcessor),
    });

    const screenshot = await screenshotter.takeScreenshot('.test', {
      ignore: { x: 1, y: 2, width: 3, height: 4 },
    });

    await expectIdenticalBuffers(screenshot, redPixelBuffer);
  });

  it('should take a screenshot of an element and ignore all matching elements', async () => {
    when(client.takeScreenshot()).thenResolve(blackPixelB64);
    when(client.getElementRect('.test')).thenResolve({
      x: 0,
      y: 0,
      width: 10,
      height: 10,
    });
    when(client.getElementRect('.ignore')).thenResolve([
      { x: 1, y: 2, width: 3, height: 4 },
      { x: 5, y: 6, width: 7, height: 8 },
    ]);

    when(pngProcessor.crop(blackPixelBuffer, 0, 0, 10, 10)).thenResolve(
      whitePixelBuffer
    );
    when(pngProcessor.paint(whitePixelBuffer, 1, 2, 3, 4, '#000')).thenResolve(
      redPixelBuffer
    );
    when(pngProcessor.paint(redPixelBuffer, 5, 6, 7, 8, '#000')).thenResolve(
      blackPixelBuffer
    );

    const screenshotter = new WebdriverScreenshotter(instance(client), {
      pngProcessor: instance(pngProcessor),
    });

    const screenshot = await screenshotter.takeScreenshot('.test', {
      ignore: '.ignore',
    });

    await expectIdenticalBuffers(screenshot, blackPixelBuffer);
  });

  it('should disable animations', async () => {
    when(client.takeScreenshot()).thenResolve(blackPixelB64);
    when(client.execute(It.isAny())).thenResolve(undefined);

    const screenshotter = new WebdriverScreenshotter(instance(client), {
      pngProcessor: instance(pngProcessor),
      disableAnimations: true,
    });

    const screenshot = await screenshotter.takeScreenshot();

    await expectIdenticalBuffers(screenshot, blackPixelBuffer);
  });
});
