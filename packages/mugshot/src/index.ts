import Browser, { ElementNotFound } from './interfaces/browser';
import PNGDiffer from './interfaces/png-differ';
import PNGProcessor from './interfaces/png-processor';
import ScreenshotStorage from './interfaces/screenshot-storage';
import Screenshotter from './interfaces/screenshotter';
import FsStorage from './lib/fs-storage';
import Mugshot from './lib/mugshot';
import PixelDiffer from './lib/pixel-differ';
import BrowserViewportCropScreenshotter from './lib/browser-viewport-crop-screenshotter';
import JimpProcessor from './lib/jimp-processor';

export default Mugshot;

export {
  Browser,
  FsStorage,
  PNGDiffer,
  PNGProcessor,
  ScreenshotStorage,
  Screenshotter,
  PixelDiffer,
  ElementNotFound,
  BrowserViewportCropScreenshotter,
  JimpProcessor
};
