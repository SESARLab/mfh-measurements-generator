const { addMinutes, addYears } = require('date-fns');
const chance = require('./chance');
const {
  measurementType, unitsOfMeasure, sensors, locations, agents,
} = require('../data');

const DATE = new Date();
const PAST_DATE = addYears(DATE, -1);

function getId() {
  return chance.guid();
}

function getMeasurementType(sensorType) {
  switch (sensorType) {
    case 'airhumidity':
    case 'airtemperature':
    case 'battery':
    case 'depth_soiltemperature':
    case 'leafwetness':
    case 'pluviometer':
    case 'soiltemperature':
    case 'winddirection':
    case 'windspeed':
      return measurementType.MEASUREMENT;
    case 'depth_swp1':
    case 'depth_swp2':
    case 'solarpanel':
    case 'solarradiation':
    case 'swp1':
    case 'swp2':
      return measurementType.PHASE;
    case 'stress':
      return measurementType.TAG;
    default:
      return measurementType.MEASUREMENT;
  }
}

function getMeasurement(sensorType) {
  const type = getMeasurementType(sensorType);
  const unitOfMeasure = chance.pickone(unitsOfMeasure);

  if (type === measurementType.PHASE) {
    return {
      double_value: null,
      str_value: `${chance.floating({ min: 10, max: 120, fixed: 2 })} - ${chance.floating({ min: 10, max: 120, fixed: 2 })}`,
      unit_of_measure: unitOfMeasure,
    };
  }

  if (type === measurementType.TAG) {
    return {
      double_value: null,
      str_value: `Value: ${chance.floating({ min: 10, max: 120, fixed: 2 })}`,
      unit_of_measure: unitOfMeasure,
    };
  }

  return {
    double_value: chance.floating({ min: 1, max: 10, fixed: 2 }),
    str_value: null,
    unit_of_measure: unitOfMeasure,
  };
}

function getMeasurementTimestamps(sensorType) {
  const type = getMeasurementType(sensorType);
  const measurementTimestamp = chance.date({ min: PAST_DATE, max: DATE });
  const insertionTimestamp = addMinutes(measurementTimestamp, chance.integer({ min: 20, max: 60 }));

  if (type === measurementType.PHASE) {
    const endTimestamp = addMinutes(measurementTimestamp, chance.integer({ min: 1, max: 5 }));

    return {
      measure_timestamp: null,
      start_timestamp: measurementTimestamp.toISOString(),
      end_timestamp: endTimestamp.toISOString(),
      insertion_timestamp: insertionTimestamp.toISOString(),
    };
  }

  return {
    measure_timestamp: measurementTimestamp.toISOString(),
    start_timestamp: null,
    end_timestamp: null,
    insertion_timestamp: insertionTimestamp.toISOString(),
  };
}

function getLocation(minLatitude, maxLatitude, minLongitude, maxLongitude, minAltitude, maxAltitude) {
  const location = chance.pickone(locations);

  return {
    ...location,
    location_latitude: chance.latitude({ min: minLatitude, max: maxLatitude, fixed: 6 }),
    location_longitude: chance.longitude({ min: minLongitude, max: maxLongitude, fixed: 6 }),
    location_altitude: chance.floating({ min: minAltitude, max: maxAltitude, fixed: 2 }),
  };
}

function getSensor() {
  return chance.pickone(sensors);
}

function getAgent() {
  return {
    insertion_agent: chance.pickone(agents),
  };
}

module.exports = {
  getId,
  getMeasurementType,
  getMeasurement,
  getMeasurementTimestamps,
  getLocation,
  getSensor,
  getAgent,
};
