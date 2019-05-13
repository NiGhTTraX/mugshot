import PNGProcessor from '../interfaces/png-processor';

export default class JimpProcessor implements PNGProcessor {
  crop = () => Promise.resolve(Buffer.from(''))
}
