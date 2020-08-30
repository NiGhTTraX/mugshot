/* istanbul ignore file */
import Webdriver, {
  ElementNotFoundError,
  ElementNotVisibleError,
} from './interfaces/webdriver';
import PNGDiffer from './interfaces/png-differ';
import PNGProcessor from './interfaces/png-processor';
import ScreenshotStorage from './interfaces/screenshot-storage';
import Screenshotter from './interfaces/screenshotter';
import FsStorage from './lib/fs-storage';
import Mugshot from './lib/mugshot';
import PixelDiffer from './lib/pixel-differ';
import WebdriverScreenshotter from './lib/webdriver-screenshotter';
import JimpProcessor from './lib/jimp-processor';

export default Mugshot;

export {
  Webdriver,
  FsStorage,
  PNGDiffer,
  PNGProcessor,
  ScreenshotStorage,
  Screenshotter,
  PixelDiffer,
  ElementNotFoundError,
  ElementNotVisibleError,
  WebdriverScreenshotter,
  JimpProcessor,
};
