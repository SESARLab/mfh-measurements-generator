const fs = require('fs');
const path = require('path');
const jsonexport = require('jsonexport');
const split = require('split2');
const { SingleBar, Presets } = require('cli-progress');
const { Transform } = require('stream');
const {
  NUMBER_OF_ROWS, MIN_LATITUDE, MAX_LATITUDE, MIN_LONGITUDE, MAX_LONGITUDE, MIN_ALTITUDE, MAX_ALTITUDE,
} = require('./config');
const {
  getId, getSensor, getLocation, getMeasurement, getMeasurementTimestamps, getAgent,
} = require('./lib/random');

const { info, error } = console;

const NOW = Date.now();
const JSON_OUTPUT = path.resolve(`${__dirname}/output`, `dl-measurements_${NOW}.ndjson`);
const CSV_OUTPUT = path.resolve(`${__dirname}/output`, `dl-measurements_${NOW}.csv`);

async function writeJSON() {
  return new Promise((resolve, reject) => {
    const progress = new SingleBar({}, Presets.shades_classic);
    const jsonWriter = fs.createWriteStream(JSON_OUTPUT, { flags: 'a' });

    jsonWriter.on('error', reject);
    jsonWriter.on('close', () => {
      progress.stop();
      info(`\nCorrectly wrote ${NUMBER_OF_ROWS} measurement in ndjson format\n`);
      resolve();
    });

    info(`Writing ${JSON_OUTPUT} file\n`);

    progress.start(NUMBER_OF_ROWS, 0);

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
      progress.increment();
    }

    jsonWriter.end();
  });
}

async function writeCSV() {
  return new Promise((resolve, reject) => {
    const progress = new SingleBar({}, Presets.shades_classic);
    const jsonReader = fs.createReadStream(JSON_OUTPUT);
    const csvWriter = fs.createWriteStream(CSV_OUTPUT);

    jsonReader.on('error', reject);
    csvWriter.on('error', reject);
    csvWriter.on('close', () => {
      progress.stop();
      info(`\nCorrectly wrote ${NUMBER_OF_ROWS} measurement in csv format\n`);
      resolve();
    });

    info(`Writing ${CSV_OUTPUT} file\n`);

    progress.start(NUMBER_OF_ROWS, 0);

    jsonReader
      .pipe(split())
      .pipe(new Transform({
        transform(chunk, _, callback) {
          this.push(chunk);
          progress.increment();
          callback();
        },
      }))
      .pipe(jsonexport())
      .pipe(csvWriter);
  });
}

(async () => {
  try {
    await writeJSON();
    await writeCSV();
  } catch (err) {
    error({ err });
  }
})();
