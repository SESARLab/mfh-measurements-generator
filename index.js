const fs = require('fs');
const path = require('path');
// const jsonexport = require('jsonexport');
const {
  NUMBER_OF_ROWS, MIN_LATITUDE, MAX_LATITUDE, MIN_LONGITUDE, MAX_LONGITUDE, MIN_ALTITUDE, MAX_ALTITUDE,
} = require('./config');
const {
  getId, getSensor, getLocation, getMeasurement, getMeasurementTimestamps, getAgent,
} = require('./lib/random');

const JSON_OUTPUT = path.resolve(`${__dirname}/output`, `dl_measurements-${Date.now()}.ndjson`);

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
