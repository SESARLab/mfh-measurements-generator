const fs = require('fs');
const path = require('path');
const jsonexport = require('jsonexport');
const split = require('split2');
const { SingleBar, Presets } = require('cli-progress');
const { Transform } = require('stream');
const {
  NUMBER_OF_ROWS, MIN_LATITUDE, MAX_LATITUDE, MIN_LONGITUDE, MAX_LONGITUDE, MIN_ALTITUDE, MAX_ALTITUDE,
} = require('./config');
const { getMeasurement } = require('./lib/random');

const { info, error } = console;

const NOW = Date.now();
const JSON_OUTPUT = path.resolve(`${__dirname}/output`, `dl-measurements_${NOW}.ndjson`);
const CSV_OUTPUT = path.resolve(`${__dirname}/output`, `dl-measurements_${NOW}.csv`);

async function writeJSON() {
  return new Promise((resolve, reject) => {
    let index = 0;
    const progress = new SingleBar({}, Presets.shades_classic);
    const jsonWriter = fs.createWriteStream(JSON_OUTPUT, { flags: 'a' });

    jsonWriter.on('error', reject);
    jsonWriter.on('close', () => {
      progress.stop();
      info(`\nCorrectly wrote ${NUMBER_OF_ROWS} measurement in ndjson format\n`);
      resolve();
    });

    function write(data, next) {
      const wrote = jsonWriter.write(data, 'utf-8');
      if (!wrote) {
        jsonWriter.once('drain', next);
      } else {
        process.nextTick(next);
      }
    }

    function run() {
      if (index < NUMBER_OF_ROWS) {
        const measurement = getMeasurement(MIN_LATITUDE, MAX_LATITUDE, MIN_LONGITUDE, MAX_LONGITUDE, MIN_ALTITUDE, MAX_ALTITUDE);

        write((`${JSON.stringify(measurement)}\n`));
        progress.increment();
        index += 1;
      } else {
        jsonWriter.end();
      }
    }

    info(`Writing ${JSON_OUTPUT} file\n`);
    progress.start(NUMBER_OF_ROWS, 0);
    run();
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
