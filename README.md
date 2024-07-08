# @hebcal/noaa
sunrise and sunset via NOAA algorithm with elevation, based on KosherJava

## Introduction
This is a fork/subset of [KosherZmanim](https://github.com/BehindTheMath/KosherZmanim) library with `Temporal` replacing usage of `Luxon`.

Kosher Zmanim itself is a TS/JS port of the [KosherJava](https://github.com/KosherJava/zmanim) library.

## Installation
```bash
$ npm install @hebcal/noaa
```

## Synopsis
```javascript
import {GeoLocation, NOAACalculator} from '@hebcal/noaa';
import {Temporal} from 'temporal-polyfill';

const latitude = 39.73915;
const longitude = -104.9847;
const elevtion = 1636;
const tzid = 'America/Denver';
const gloc = new GeoLocation(null, latitude, longitude, elevtion, tzid);
const plainDate = new Temporal.PlainDate(2020, 6, 5); // Friday June 5 2020
const noaa = new NOAACalculator(gloc, plainDate);

const zdt = noaa.getSunset();
console.log(zdt.toString()); // '2020-06-05T20:32:57.848-06:00[America/Denver]'
```

## [API Documentation](https://hebcal.github.io/api/noaa/index.html)
