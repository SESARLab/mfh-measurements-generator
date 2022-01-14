// eslint-disable-next-line import/no-extraneous-dependencies
const { describe, it } = require('@jest/globals');
const { addMinutes, addYears, format } = require('date-fns');
const chance = require('../../lib/random/chance');
const {
  measurementType, unitsOfMeasure, locations, agents, sensors,
} = require('../../data');
const random = require('../../lib/random');

const {
  DATE_FORMAT, getId, getMeasurementType, getMeasurementValues, getMeasurementTimestamps, getLocation, getSensor, getAgent, getMeasurement,
} = random;

jest.mock('date-fns');
jest.mock('../../lib/random/chance', () => ({
  guid: jest.fn(),
  integer: jest.fn(),
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
      const guid = 'a6edc906-2f9f-5fb2-a373-efac406f0ef2';
      chance.guid.mockReturnValue(guid);

      const actual = getId();

      expect(chance.guid).toHaveBeenCalled();
      expect(actual).toEqual(guid);
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

  describe('getMeasurementValues', () => {
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
    ])('should return a random "discrete" double value when sensorType is "%s" (of measurementType MEASUREMENT)', (sensorType) => {
      const unitOfMeasure = 'C';
      const floatValue = 1.25;

      chance.pickone.mockReturnValue(unitOfMeasure);
      chance.floating.mockReturnValueOnce(floatValue);
      const actual = getMeasurementValues(sensorType);

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
    ])('should return a random "range" string value when sensorType is "%s" (of measurementType PHASE)', (sensorType) => {
      const unitOfMeasure = 'C';
      const firstFloatValue = 1.25;
      const secondFloatValue = 7.25;

      chance.pickone.mockReturnValue(unitOfMeasure);
      chance.floating
        .mockReturnValueOnce(firstFloatValue)
        .mockReturnValueOnce(secondFloatValue);

      const actual = getMeasurementValues(sensorType);

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
    ])('should return a random string value when sensorType is "%s" (of measurementType TAG)', (sensorType) => {
      const unitOfMeasure = 'C';
      const floatValue = 1.25;

      chance.pickone.mockReturnValue(unitOfMeasure);
      chance.floating.mockReturnValueOnce(floatValue);

      const actual = getMeasurementValues(sensorType);

      expect(chance.pickone).toHaveBeenCalledWith(unitsOfMeasure);
      expect(chance.floating).toHaveBeenCalledWith({ min: 10, max: 120, fixed: 2 });
      expect(actual).toEqual({
        double_value: null,
        str_value: `Value: ${floatValue}`,
        unit_of_measure: unitOfMeasure,
      });
    });
  });

  describe('getMeasurementTimestamps', () => {
    it('should return a random measurement timestamp in one year range, and with a random calculted insertion time', () => {
      format.mockImplementation((date) => date);

      const pastYear = new Date();
      addYears.mockReturnValue(pastYear);

      const measurementTimestamp = new Date();
      chance.date.mockReturnValue(measurementTimestamp);

      const minutes = 30;
      chance.integer.mockReturnValue(minutes);

      const insertionTimestamp = new Date();
      addMinutes.mockReturnValue(insertionTimestamp);

      const actual = getMeasurementTimestamps('airhumidity');

      expect(addYears).toHaveBeenCalledWith(expect.any(Object), -1);
      expect(chance.date).toHaveBeenCalledWith({ min: pastYear, max: expect.any(Object) });
      expect(chance.integer).toHaveBeenCalledWith({ min: 20, max: 60 });
      expect(addMinutes).toHaveBeenCalledWith(measurementTimestamp, minutes);
      expect(format).toHaveBeenNthCalledWith(1, measurementTimestamp, DATE_FORMAT);
      expect(format).toHaveBeenNthCalledWith(2, insertionTimestamp, DATE_FORMAT);
      expect(actual).toEqual({
        measure_timestamp: measurementTimestamp,
        start_timestamp: null,
        end_timestamp: null,
        insertion_timestamp: insertionTimestamp,
      });
    });

    it('should return random start and end timestamp in one year range, and with a random calculted insertion time, for PHASE measurementType', () => {
      format.mockImplementation((date) => date);

      const pastYear = new Date();
      addYears.mockReturnValue(pastYear);

      const measurementTimestamp = new Date();
      chance.date.mockReturnValue(measurementTimestamp);

      const minutes = 30;
      chance.integer.mockReturnValue(minutes);

      const insertionTimestamp = new Date();
      addMinutes.mockReturnValue(insertionTimestamp);

      const actual = getMeasurementTimestamps('depth_swp1');

      expect(addYears).toHaveBeenCalledWith(expect.any(Object), -1);
      expect(chance.date).toHaveBeenCalledWith({ min: pastYear, max: expect.any(Object) });
      expect(chance.integer).toHaveBeenCalledWith({ min: 20, max: 60 });
      expect(addMinutes).toHaveBeenNthCalledWith(1, measurementTimestamp, minutes);
      expect(addMinutes).toHaveBeenNthCalledWith(2, measurementTimestamp, minutes);
      expect(format).toHaveBeenNthCalledWith(1, measurementTimestamp, DATE_FORMAT);
      expect(format).toHaveBeenNthCalledWith(2, measurementTimestamp, DATE_FORMAT);
      expect(format).toHaveBeenNthCalledWith(3, insertionTimestamp, DATE_FORMAT);
      expect(actual).toEqual({
        measure_timestamp: null,
        start_timestamp: measurementTimestamp,
        end_timestamp: measurementTimestamp,
        insertion_timestamp: insertionTimestamp,
      });
    });

    it('should return a random measurement timestamp in the desired year range, and with a random calculted insertion time', () => {
      format.mockImplementation((date) => date);

      const pastYear = new Date();
      addYears.mockReturnValue(pastYear);

      const measurementTimestamp = new Date();
      chance.date.mockReturnValue(measurementTimestamp);

      const minutes = 30;
      chance.integer.mockReturnValue(minutes);

      const insertionTimestamp = new Date();
      addMinutes.mockReturnValue(insertionTimestamp);

      const years = 4;
      getMeasurementTimestamps('airhumidity', years);

      expect(addYears).toHaveBeenCalledWith(expect.any(Object), -years);
    });
  });

  describe('getLocation', () => {
    it('should return a random location, with randomly calculated latitue, longitude and altitude', () => {
      const minLatitude = 45.0;
      const maxLatitude = 45.5;
      const minLongitude = 9.0;
      const maxLongitude = 9.5;
      const minAltitude = 1.0;
      const maxAltitude = 5.0;
      const latitude = 45.1;
      const longitude = 0.1;
      const altitude = 1.1;
      const location = {
        location_id: 'sw_terrain',
        location_name: 'Brazilian Glorytree',
        location_botanic_name: 'Tibouchina granulosa (Desr.) Cogn.',
        location_cultivation_name: 'Melastomataceae',
        location_description: 'Organic full-range budgetary management',
      };

      chance.pickone.mockReturnValue(location);
      chance.latitude.mockReturnValue(latitude);
      chance.longitude.mockReturnValue(longitude);
      chance.floating.mockReturnValue(altitude);

      const actual = getLocation(minLatitude, maxLatitude, minLongitude, maxLongitude, minAltitude, maxAltitude);

      expect(chance.pickone).toHaveBeenCalledWith(locations);
      expect(chance.latitude).toHaveBeenCalledWith({ min: minLatitude, max: maxLatitude, fixed: 4 });
      expect(chance.longitude).toHaveBeenCalledWith({ min: minLongitude, max: maxLongitude, fixed: 4 });
      expect(chance.floating).toHaveBeenCalledWith({ min: minAltitude, max: maxAltitude, fixed: 4 });
      expect(actual).toEqual({
        ...location,
        location_latitude: latitude,
        location_longitude: longitude,
        location_altitude: altitude,
      });
    });
  });

  describe('getSensor', () => {
    it('should return a random sensor', () => {
      const sensor = {
        sensor_id: 'TS_0310B472-battery',
        sensor_type: 'battery',
        sensor_desc_name: 'ICON TS sensor group',
      };
      chance.pickone.mockReturnValue(sensor);

      const actual = getSensor();

      expect(chance.pickone).toHaveBeenCalledWith(sensors);
      expect(actual).toEqual(sensor);
    });
  });

  describe('getAgent', () => {
    it('should return a random agent', () => {
      const agent = 'rover_agent';
      chance.pickone.mockReturnValue(agent);

      const actual = getAgent();

      expect(chance.pickone).toHaveBeenCalledWith(agents);
      expect(actual).toEqual({
        insertion_agent: agent,
      });
    });
  });

  describe('getMeasurement', () => {
    it('should return a randomly generated object, representing a single measurement', () => {
      const minLatitude = 45.0;
      const maxLatitude = 45.5;
      const minLongitude = 9.0;
      const maxLongitude = 9.5;
      const minAltitude = 1.0;
      const maxAltitude = 5.0;

      // Expected values
      const guid = 'a6edc906-2f9f-5fb2-a373-efac406f0ef2';
      const sensor = {
        sensor_id: 'TS_0310B472-battery',
        sensor_type: 'battery',
        sensor_desc_name: 'ICON TS sensor group',
      };
      const unitOfMeasure = 'C';
      const floatValue = 1.25;
      const latitude = 45.1;
      const longitude = 0.1;
      const altitude = 1.1;
      const location = {
        location_id: 'sw_terrain',
        location_name: 'Brazilian Glorytree',
        location_botanic_name: 'Tibouchina granulosa (Desr.) Cogn.',
        location_cultivation_name: 'Melastomataceae',
        location_description: 'Organic full-range budgetary management',
      };

      const date = new Date();
      const minutes = 30;
      const agent = 'rover_agent';

      addYears.mockReturnValue(date);
      addMinutes.mockReturnValue(date);
      format.mockImplementation((d) => d);

      chance.guid.mockReturnValue(guid);
      chance.pickone
        .mockReturnValueOnce(sensor)
        .mockReturnValueOnce(unitOfMeasure)
        .mockReturnValueOnce(location)
        .mockReturnValueOnce(agent);

      chance.latitude.mockReturnValue(latitude);
      chance.longitude.mockReturnValue(longitude);
      chance.floating
        .mockReturnValueOnce(floatValue)
        .mockReturnValueOnce(altitude);

      chance.integer.mockReturnValue(minutes);
      chance.date.mockReturnValue(date);

      const actual = getMeasurement(minLatitude, maxLatitude, minLongitude, maxLongitude, minAltitude, maxAltitude);

      expect(actual).toEqual({
        id: guid,
        ...sensor,
        double_value: floatValue,
        str_value: null,
        unit_of_measure: unitOfMeasure,
        ...location,
        location_latitude: latitude,
        location_longitude: longitude,
        location_altitude: altitude,
        insertion_agent: agent,
        measure_timestamp: date,
        start_timestamp: null,
        end_timestamp: null,
        insertion_timestamp: date,
      });
    });
  });
});
