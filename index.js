const fs = require('fs');
const path = require('path');
const jsonexport = require('jsonexport');
const split = require('split2');
const logger = require('pino')();
const {
  NUMBER_OF_ROWS, MIN_LATITUDE, MAX_LATITUDE, MIN_LONGITUDE, MAX_LONGITUDE, MIN_ALTITUDE, MAX_ALTITUDE,
} = require('./config');
const {
  getId, getSensor, getLocation, getMeasurement, getMeasurementTimestamps, getAgent,
} = require('./lib/random');

const NOW = Date.now();
const JSON_OUTPUT = path.resolve(`${__dirname}/output`, `dl_measurements-${NOW}.ndjson`);
const CSV_OUTPUT = path.resolve(`${__dirname}/output`, `dl_measurements-${NOW}.csv`);

async function writeJSON() {
  return new Promise((resolve, reject) => {
    const jsonWriter = fs.createWriteStream(JSON_OUTPUT, { flags: 'a' });

    jsonWriter.on('error', reject);
    jsonWriter.on('close', () => {
      logger.info(`Correctly wrote ${NUMBER_OF_ROWS} measurement in ndjson format`);
      resolve();
    });

    logger.info(`Start to write ${JSON_OUTPUT} file`);

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

      jsonWriter.write(`${JSON.stringify(row)}\n`);
    }

    jsonWriter.end();
  });
}

async function writeCSV() {
  return new Promise((resolve, reject) => {
    const jsonReader = fs.createReadStream(JSON_OUTPUT);
    const csvWriter = fs.createWriteStream(CSV_OUTPUT);

    jsonReader.on('error', reject);
    csvWriter.on('error', reject);
    csvWriter.on('close', () => {
      logger.info(`Correctly wrote ${NUMBER_OF_ROWS} measurement in csv format`);
      resolve();
    });

    logger.info(`Start to write ${CSV_OUTPUT} file`);

    jsonReader
      .pipe(split())
      .pipe(jsonexport())
      .pipe(csvWriter);
  });
}

(async () => {
  try {
    await writeJSON();
    await writeCSV();
  } catch (err) {
    logger.error({ err });
  }
})();
