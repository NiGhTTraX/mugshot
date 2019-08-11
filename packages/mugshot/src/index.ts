import Mugshot from './lib/mugshot';
import Browser, { ElementNotFound } from './interfaces/browser';
import PNGProcessor from './interfaces/png-processor';
import PNGDiffer from './interfaces/png-differ';
import ScreenshotStorage from './interfaces/screenshot-storage';
import Screenshotter from './interfaces/screenshotter';
import PixelDiffer from './lib/pixel-differ';

export default Mugshot;

export {
  Browser,
  PNGDiffer,
  PNGProcessor,
  ScreenshotStorage,
  Screenshotter,
  PixelDiffer,
  ElementNotFound
};
