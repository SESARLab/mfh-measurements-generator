const chance = require('../../lib/random/chance');
const { getId } = require('../../lib/random');

jest.mock('../../lib/random/chance', () => ({
  guid: jest.fn(),
  floating: jest.fn(),
  date: jest.fn(),
  pickone: jest.fn(),
  latitude: jest.fn(),
  longitude: jest.fn(),
  altitude: jest.fn(),
}));

describe('random', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getId', () => {
    it('should return a random guid', () => {
      const expected = 'a6edc906-2f9f-5fb2-a373-efac406f0ef2';
      chance.guid.mockReturnValue(expected);

      const actual = getId();

      expect(chance.guid).toHaveBeenCalled();
      expect(actual).toEqual(expected);
    });
  });
});
