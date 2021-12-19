// eslint-disable-next-line import/no-extraneous-dependencies
const { describe, it } = require('@jest/globals');
const chance = require('../../lib/random/chance');
const { measurementType, unitsOfMeasure } = require('../../lib/data');
const { getId, getMeasurementType, getMeasurement } = require('../../lib/random');

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

  describe('getMeasurementType', () => {
    it.each([
      [measurementType.MEASUREMENT, 'airhumidity'],
      [measurementType.MEASUREMENT, 'airtemperature'],
      [measurementType.MEASUREMENT, 'battery'],
      [measurementType.MEASUREMENT, 'depth_soiltemperature'],
      [measurementType.MEASUREMENT, 'leafwetness'],
      [measurementType.MEASUREMENT, 'pluviometer'],
      [measurementType.MEASUREMENT, 'soiltemperature'],
      [measurementType.MEASUREMENT, 'winddirection'],
      [measurementType.MEASUREMENT, 'windspeed'],
      [measurementType.PHASE, 'depth_swp1'],
      [measurementType.PHASE, 'depth_swp2'],
      [measurementType.PHASE, 'solarpanel'],
      [measurementType.PHASE, 'solarradiation'],
      [measurementType.PHASE, 'swp1'],
      [measurementType.PHASE, 'swp2'],
      [measurementType.TAG, 'stress'],
    ])('should return %s when sensorType is "%s"', (expected, sensorType) => {
      const actual = getMeasurementType(sensorType);

      expect(actual).toEqual(expected);
    });

    it('should return MEASUREMENT for any unknown sensorType', () => {
      const actual = getMeasurementType('foo');

      expect(actual).toEqual(measurementType.MEASUREMENT);
    });
  });

  describe('getMeasurement', () => {
    it.each([
      'airhumidity',
      'airtemperature',
      'battery',
      'depth_soiltemperature',
      'leafwetness',
      'pluviometer',
      'soiltemperature',
      'winddirection',
      'windspeed',
    ])('should return a "discrete" double value when sensorType is "%s" (of measurementType MEASUREMENT)', (sensorType) => {
      const unitOfMeasure = 'C';
      const floatValue = 1.25;

      chance.pickone.mockReturnValue(unitOfMeasure);
      chance.floating.mockReturnValueOnce(floatValue);
      const actual = getMeasurement(sensorType);

      expect(chance.pickone).toHaveBeenCalledWith(unitsOfMeasure);
      expect(chance.floating).toHaveBeenCalledWith({ min: 1, max: 10, fixed: 2 });
      expect(actual).toEqual({
        double_value: floatValue,
        str_value: null,
        unit_of_measure: unitOfMeasure,
      });
    });

    it.each([
      'depth_swp1',
      'depth_swp2',
      'solarpanel',
      'solarradiation',
    ])('should return a "range" string value when sensorType is "%s" (of measurementType PHASE)', (sensorType) => {
      const unitOfMeasure = 'C';
      const firstFloatValue = 1.25;
      const secondFloatValue = 7.25;

      chance.pickone.mockReturnValue(unitOfMeasure);
      chance.floating
        .mockReturnValueOnce(firstFloatValue)
        .mockReturnValueOnce(secondFloatValue);

      const actual = getMeasurement(sensorType);

      expect(chance.pickone).toHaveBeenCalledWith(unitsOfMeasure);
      expect(chance.floating).toHaveBeenNthCalledWith(1, { min: 10, max: 120, fixed: 2 });
      expect(chance.floating).toHaveBeenNthCalledWith(2, { min: 10, max: 120, fixed: 2 });
      expect(actual).toEqual({
        double_value: null,
        str_value: `${firstFloatValue} - ${secondFloatValue}`,
        unit_of_measure: unitOfMeasure,
      });
    });

    it.each([
      'stress',
    ])('should return a string value when sensorType is "%s" (of measurementType TAG)', (sensorType) => {
      const unitOfMeasure = 'C';
      const floatValue = 1.25;

      chance.pickone.mockReturnValue(unitOfMeasure);
      chance.floating.mockReturnValueOnce(floatValue);

      const actual = getMeasurement(sensorType);

      expect(chance.pickone).toHaveBeenCalledWith(unitsOfMeasure);
      expect(chance.floating).toHaveBeenCalledWith({ min: 10, max: 120, fixed: 2 });
      expect(actual).toEqual({
        double_value: null,
        str_value: `Value: ${floatValue}`,
        unit_of_measure: unitOfMeasure,
      });
    });
  });
});
