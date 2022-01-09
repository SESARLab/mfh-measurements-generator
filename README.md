# MIND Foods HUB DL Measurements data generator

A command-line application that generates measurements data for MIND Foods Hub Data Lake.
Data is generated in two formats: [CSV](https://it.wikipedia.org/wiki/Comma-separated_values) and [ndjson](http://ndjson.org/).

### Schema and logical constraints

MIND Foods Hub data are stored in a single table, named `dl_measurements`, that follows a denormalized data model to avoid expensive join operations.
This means that, for each row of the table, we can have missing (`NULL`) values, depending on the type of measurement.
MIND Foods Hub sensors are of three types:

- Measurements, that register discrete, floating-point, values (for example temperature, humidity, wind speed, etc, etc).
This type of measurement is stored in `double_value` column, while the time of the measurement is stored in the `measure_timestamp` column.

- Phase sensors, that register a range of floating-point values in a given period.
This type of measurement is stored in the `str_value` column, while the time start and end of the measurement are stored respectively in the `start_timestamp` and `end_timestamp` columns.

- Tag sensors, that register string-based values.
This type of measurement is stored in `double_value` column, while the time of the measurement is stored in the `measure_timestamp` column.


To randomly generate data for `dl_measurements` we need to mock this relation between a sensor type and its measurement, and guarantee these logical constraints:

- `double_value` is only populated for float-based measurements while `str_value` is `NULL`.
`measure_timestamp` is calculated, while `start_timestamp` and `end_timestamp` are `NULL`

- For phase-based measurement `str_value` is populated, while `double_value` is `NULL`.
Both `start_timestamp` and `end_timestamp` times are calculated, while `measure_timestamp` is `NULL`

- For tag based measurement `str_value` is populated, while `double_value` is `NULL`.
`measure_timestamp` is calculated, while `start_timestamp` and `end_timestamp` are `NULL`

### Usage

First, install "DL Measurements data generator" dependencies:

```sh
$ npm i
```

Then run the application with the following command:

```sh
$ node index.js
```

By default "DL Measurements data generator" generates 5 million rows for both the CSV and ndjson files.
To configure the number of rows to generate, use NUMBER_OF_ROWS env variable:

```sh
$ NUMBER_OF_ROWS=100 node index.js
```

Other configuration env variables can be found in [config.js](./config.js) file.
