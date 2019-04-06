import { describe, it } from '../suite';
import Mugshot from '../../../src';

describe('Mugshot', () => {
  it('should not blow up', () => {
    // eslint-disable-next-line no-new
    new Mugshot();
  });
});
