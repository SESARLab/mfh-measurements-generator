const NUMBER_OF_ROWS = process.env.NUMBER_OF_ROWS || 5_000_000;
const MIN_LATITUDE = process.env.MIN_LATITUDE || 45.38676;
const MAX_LATITUDE = process.env.MAX_LATITUDE || 45.53582;
const MIN_LONGITUDE = process.env.MIN_LONGITUDE || 9.04091;
const MAX_LONGITUDE = process.env.MAX_LONGITUDE || 9.27808;
const MIN_ALTITUDE = process.env.MIN_ALTITUDE || 1;
const MAX_ALTITUDE = process.env.MAX_ALTITUDE || 10;
const YEARS = process.env.YEARS || 1;

module.exports = {
  NUMBER_OF_ROWS,
  MIN_LATITUDE,
  MAX_LATITUDE,
  MIN_LONGITUDE,
  MAX_LONGITUDE,
  MIN_ALTITUDE,
  MAX_ALTITUDE,
  YEARS,
};
