import Mugshot from './lib/mugshot';
import Browser, { ElementNotFound } from './interfaces/browser';
import PNGProcessor from './interfaces/png-processor';
import PNGDiffer from './interfaces/png-differ';
import FileSystem from './interfaces/file-system';
import Screenshotter from './interfaces/screenshotter';
import pixelDiffer from './lib/pixel-differ';

export default Mugshot;

export {
  Browser,
  PNGDiffer,
  PNGProcessor,
  FileSystem,
  Screenshotter,
  pixelDiffer,
  ElementNotFound
};
