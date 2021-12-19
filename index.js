const fs = require('fs');
const path = require('path');
// const jsonexport = require('jsonexport');
const {
  getId, getSensor, getLocation, getMeasurement, getMeasurementTimestamps, getAgent,
} = require('./random');

const NUMBER_OF_ROWS = 5_000_000;
const JSON_OUTPUT = path.resolve(`${__dirname}/data/output`, `dl_measurements-${Date.now()}.ndjson`);
const MIN_LATITUDE = 45.38676;
const MAX_LATITUDE = 45.53582;
const MIN_LONGITUDE = 9.04091;
const MAX_LONGITUDE = 9.27808;
const MIN_ALTITUDE = 1;
const MAX_ALTITUDE = 10;

(function run() {
  const stream = fs.createWriteStream(JSON_OUTPUT, { flags: 'a' });

  for (let i = 0; i < NUMBER_OF_ROWS; i += 1) {
    const id = getId();
    const sensor = getSensor();
    const location = getLocation(MIN_LATITUDE, MAX_LATITUDE, MIN_LONGITUDE, MAX_LONGITUDE, MIN_ALTITUDE, MAX_ALTITUDE);
    const measurement = getMeasurement(sensor.sensor_type);
    const timestamps = getMeasurementTimestamps(sensor.sensor_type);
    const agent = getAgent();

    const row = {
      id,
      ...measurement,
      ...sensor,
      ...location,
      ...agent,
      ...timestamps,
    };

    stream.write(`${JSON.stringify(row)}\n`);
  }

  stream.end();
}());
