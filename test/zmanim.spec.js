/* eslint-disable max-len */
import {test} from 'node:test';
import assert from 'node:assert';
import {Temporal} from 'temporal-polyfill';
import {GeoLocation, NOAACalculator} from '../dist/index.js';

// eslint-disable-next-line require-jsdoc
function makeZmanWithElevation() {
  const latitude = 39.73915;
  const longitude = -104.9847;
  const elevtion = 1636;
  const tzid = 'America/Denver';
  const gloc = new GeoLocation(null, latitude, longitude, elevtion, tzid);
  const plainDate = new Temporal.PlainDate(2020, 6, 5); // Friday June 5 2020
  const noaa = new NOAACalculator(gloc, plainDate);
  return noaa;
}

  /*
   * | Civil Date | Jun 5, 2020|
   * | Jewish Date | 13 Sivan, 5780|
   * | Day of Week | Fri|
   * | Alos 16.1° | 3:48:37 AM|
   * | Alos 72 Minutes | 4:12:30 AM|
   * | Misheyakir 10.2° | 4:32:14 AM|
   * | Sunrise (1636.0 Meters) | 5:24:30 AM|
   * | Sunrise (Sea Level) | 5:32:26 AM|
   * | Sof Zman Shma MGA 72 Minutes | 8:35:37 AM|
   * | Sof Zman Shma GRA | 9:11:37 AM|
   * | Sof Zman Tfila MGA 72 Minutes | 10:03:19 AM|
   * | Sof Zman Tfila GRA | 10:27:19 AM|
   * | Chatzos Astronomical | 12:58:30 PM|
   * | Mincha Gedola GRA | 1:36:35 PM|
   * | Plag Hamincha | 6:58:19 PM|
   * | Candle Lighting 18 Minutes | 8:07:01 PM|
   * | Sunset (Sea Level) | 8:25:01 PM|
   * | Sunset (1636.0 Meters) | 8:32:57 PM|
   * | Tzais Geonim 8.5° | 9:13:45 PM|
   * | Tzais 72 Minutes | 9:44:57 PM|
   * | Tzais 16.1° | 10:09:05 PM
   */

test('getSunrise', () => {
  const noaa = makeZmanWithElevation();
  const zdt = noaa.getSunrise();
  assert.strictEqual(zdt.toString(), '2020-06-05T05:24:30.501-06:00[America/Denver]');
});

test('getSeaLevelSunrise', () => {
  const noaa = makeZmanWithElevation();
  const zdt = noaa.getSeaLevelSunrise();
  assert.strictEqual(zdt.toString(), '2020-06-05T05:32:26.007-06:00[America/Denver]');
});

test('getSunset', () => {
  const noaa = makeZmanWithElevation();
  const zdt = noaa.getSunset();
  assert.strictEqual(zdt.toString(), '2020-06-05T20:32:57.848-06:00[America/Denver]');
});

test('getSeaLevelSunset', () => {
  const noaa = makeZmanWithElevation();
  const zdt = noaa.getSeaLevelSunset();
  assert.strictEqual(zdt.toString(), '2020-06-05T20:25:01.588-06:00[America/Denver]');
});

test('getSunriseOffsetByDegrees', () => {
  const noaa = makeZmanWithElevation();
  const zdt1 = noaa.getSunriseOffsetByDegrees(90 + 16.1);
  assert.strictEqual(zdt1.toString(), '2020-06-05T03:48:37.581-06:00[America/Denver]');
  const zdt2 = noaa.getSunriseOffsetByDegrees(90 + 11.5);
  assert.strictEqual(zdt2.toString(), '2020-06-05T04:23:08.923-06:00[America/Denver]');
  const zdt3 = noaa.getSunriseOffsetByDegrees(90 + 10.2);
  assert.strictEqual(zdt3.toString(), '2020-06-05T04:32:14.456-06:00[America/Denver]');
});


test('getSunsetOffsetByDegrees', () => {
  const noaa = makeZmanWithElevation();
  const zdt1 = noaa.getSunsetOffsetByDegrees(90 + 7.083);
  assert.strictEqual(zdt1.toString(), '2020-06-05T21:04:21.276-06:00[America/Denver]');
  const zdt2 = noaa.getSunsetOffsetByDegrees(90 + 8.5);
  assert.strictEqual(zdt2.toString(), '2020-06-05T21:13:45.311-06:00[America/Denver]');
});

test('getSunTransit', () => {
  const noaa = makeZmanWithElevation();
  const zdt = noaa.getSunTransit();
  assert.strictEqual(zdt.toString(), '2020-06-05T12:58:43.797-06:00[America/Denver]');
});
