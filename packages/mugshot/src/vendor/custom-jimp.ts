import CustomJimp from 'jimp';
// @ts-ignore because no type defs
import configure from '@jimp/custom';
import pluginCrop from './jimp-crop';

configure({
  plugins: [pluginCrop]
});

export default CustomJimp;
