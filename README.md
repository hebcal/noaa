# @hebcal/noaa
sunrise and sunset via NOAA algorithm with elevation, based on KosherJava

## Introduction
This is a fork/subset of [KosherZmanim](https://github.com/BehindTheMath/KosherZmanim) library with `Temporal` replacing usage of `Luxon`.

Kosher Zmanim itself is a TS/JS port of the [KosherJava](https://github.com/KosherJava/zmanim) library.

## Installation
```bash
$ npm install @hebcal/noaa
```

## Classes

<dl>
<dt><a href="#GeoLocation">GeoLocation</a></dt>
<dd><p>A class that contains location information such as latitude and longitude required for astronomical calculations. The
elevation field may not be used by some calculation engines and would be ignored if set.</p>
</dd>
<dt><a href="#NOAACalculator">NOAACalculator</a></dt>
<dd><p>Implementation of sunrise and sunset methods to calculate astronomical times based on the <a
href="http://noaa.gov">NOAA</a> algorithm. This calculator uses the Java algorithm based on the implementation by <a
href="http://noaa.gov">NOAA - National Oceanic and Atmospheric Administration</a>&#39;s <a href =
"http://www.srrb.noaa.gov/highlights/sunrise/sunrise.html">Surface Radiation Research Branch</a>. NOAA&#39;s <a
href="http://www.srrb.noaa.gov/highlights/sunrise/solareqns.PDF">implementation</a> is based on equations from <a
href="http://www.willbell.com/math/mc1.htm">Astronomical Algorithms</a> by <a
href="http://en.wikipedia.org/wiki/Jean_Meeus">Jean Meeus</a>. Added to the algorithm is an adjustment of the zenith
to account for elevation. The algorithm can be found in the <a
href="http://en.wikipedia.org/wiki/Sunrise_equation">Wikipedia Sunrise Equation</a> article.</p>
</dd>
</dl>

<a name="GeoLocation"></a>

## GeoLocation
A class that contains location information such as latitude and longitude required for astronomical calculations. The
elevation field may not be used by some calculation engines and would be ignored if set.

**Kind**: global class  
**Version**: 1.1  
**Author**: &copy; Eliyahu Hershfeld 2004 - 2016  

* [GeoLocation](#GeoLocation)
    * [new GeoLocation(name, latitude, longitude, elevation, timeZoneId)](#new_GeoLocation_new)
    * [.getElevation()](#GeoLocation+getElevation) ⇒ <code>number</code>
    * [.setElevation(elevation)](#GeoLocation+setElevation)
    * [.getLatitude()](#GeoLocation+getLatitude) ⇒ <code>number</code>
    * [.getLongitude()](#GeoLocation+getLongitude) ⇒ <code>number</code>
    * [.getLocationName()](#GeoLocation+getLocationName) ⇒ <code>string</code> \| <code>null</code>
    * [.setLocationName(name)](#GeoLocation+setLocationName)
    * [.getTimeZone()](#GeoLocation+getTimeZone) ⇒ <code>string</code>
    * [.setTimeZone(timeZoneId)](#GeoLocation+setTimeZone)

<a name="new_GeoLocation_new"></a>

### new GeoLocation(name, latitude, longitude, elevation, timeZoneId)
GeoLocation constructor with parameters for all required fields.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The location name for display use such as &quot;Lakewood, NJ&quot; |
| latitude | <code>number</code> | the latitude in a double format such as 40.095965 for Lakewood, NJ.            <b>Note: </b> For latitudes south of the equator, a negative value should be used. |
| longitude | <code>number</code> | double the longitude in a double format such as -74.222130 for Lakewood, NJ.            <b>Note: </b> For longitudes west of the <a href="http://en.wikipedia.org/wiki/Prime_Meridian">Prime            Meridian </a> (Greenwich), a negative value should be used. |
| elevation | <code>number</code> | the elevation above sea level in Meters. Elevation is not used in most algorithms used for calculating            sunrise and set. |
| timeZoneId | <code>string</code> | the <code>TimeZone</code> for the location. |

<a name="GeoLocation+getElevation"></a>

### geoLocation.getElevation() ⇒ <code>number</code>
Method to get the elevation in Meters.

**Kind**: instance method of [<code>GeoLocation</code>](#GeoLocation)  
**Returns**: <code>number</code> - Returns the elevation in Meters.  
<a name="GeoLocation+setElevation"></a>

### geoLocation.setElevation(elevation)
Method to set the elevation in Meters <b>above </b> sea level.

**Kind**: instance method of [<code>GeoLocation</code>](#GeoLocation)  

| Param | Type | Description |
| --- | --- | --- |
| elevation | <code>number</code> | The elevation to set in Meters. An Error will be thrown if the value is a negative. |

<a name="GeoLocation+getLatitude"></a>

### geoLocation.getLatitude() ⇒ <code>number</code>
**Kind**: instance method of [<code>GeoLocation</code>](#GeoLocation)  
**Returns**: <code>number</code> - Returns the latitude.  
<a name="GeoLocation+getLongitude"></a>

### geoLocation.getLongitude() ⇒ <code>number</code>
**Kind**: instance method of [<code>GeoLocation</code>](#GeoLocation)  
**Returns**: <code>number</code> - Returns the longitude.  
<a name="GeoLocation+getLocationName"></a>

### geoLocation.getLocationName() ⇒ <code>string</code> \| <code>null</code>
**Kind**: instance method of [<code>GeoLocation</code>](#GeoLocation)  
**Returns**: <code>string</code> \| <code>null</code> - Returns the location name.  
<a name="GeoLocation+setLocationName"></a>

### geoLocation.setLocationName(name)
**Kind**: instance method of [<code>GeoLocation</code>](#GeoLocation)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> \| <code>null</code> | The setter method for the display name. |

<a name="GeoLocation+getTimeZone"></a>

### geoLocation.getTimeZone() ⇒ <code>string</code>
**Kind**: instance method of [<code>GeoLocation</code>](#GeoLocation)  
**Returns**: <code>string</code> - Returns the timeZone.  
<a name="GeoLocation+setTimeZone"></a>

### geoLocation.setTimeZone(timeZoneId)
Method to set the TimeZone.

**Kind**: instance method of [<code>GeoLocation</code>](#GeoLocation)  

| Param | Type | Description |
| --- | --- | --- |
| timeZoneId | <code>string</code> | The timeZone to set. |

<a name="NOAACalculator"></a>

## NOAACalculator
Implementation of sunrise and sunset methods to calculate astronomical times based on the <a
href="http://noaa.gov">NOAA</a> algorithm. This calculator uses the Java algorithm based on the implementation by <a
href="http://noaa.gov">NOAA - National Oceanic and Atmospheric Administration</a>'s <a href =
"http://www.srrb.noaa.gov/highlights/sunrise/sunrise.html">Surface Radiation Research Branch</a>. NOAA's <a
href="http://www.srrb.noaa.gov/highlights/sunrise/solareqns.PDF">implementation</a> is based on equations from <a
href="http://www.willbell.com/math/mc1.htm">Astronomical Algorithms</a> by <a
href="http://en.wikipedia.org/wiki/Jean_Meeus">Jean Meeus</a>. Added to the algorithm is an adjustment of the zenith
to account for elevation. The algorithm can be found in the <a
href="http://en.wikipedia.org/wiki/Sunrise_equation">Wikipedia Sunrise Equation</a> article.

**Kind**: global class  
**Author**: &copy; Eliyahu Hershfeld 2011 - 2019  

* [NOAACalculator](#NOAACalculator)
    * [new NOAACalculator(geoLocation, date)](#new_NOAACalculator_new)
    * _instance_
        * [.getSunrise()](#NOAACalculator+getSunrise) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getSeaLevelSunrise()](#NOAACalculator+getSeaLevelSunrise) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getBeginCivilTwilight()](#NOAACalculator+getBeginCivilTwilight) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getBeginNauticalTwilight()](#NOAACalculator+getBeginNauticalTwilight) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getBeginAstronomicalTwilight()](#NOAACalculator+getBeginAstronomicalTwilight) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getSunset()](#NOAACalculator+getSunset) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getSeaLevelSunset()](#NOAACalculator+getSeaLevelSunset) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getEndCivilTwilight()](#NOAACalculator+getEndCivilTwilight) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getEndNauticalTwilight()](#NOAACalculator+getEndNauticalTwilight) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getEndAstronomicalTwilight()](#NOAACalculator+getEndAstronomicalTwilight) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getSunriseOffsetByDegrees(offsetZenith)](#NOAACalculator+getSunriseOffsetByDegrees) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getSunsetOffsetByDegrees(offsetZenith)](#NOAACalculator+getSunsetOffsetByDegrees) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getUTCSunrise0(zenith)](#NOAACalculator+getUTCSunrise0) ⇒ <code>number</code>
        * [.getUTCSeaLevelSunrise(zenith)](#NOAACalculator+getUTCSeaLevelSunrise) ⇒ <code>number</code>
        * [.getUTCSunset0(zenith)](#NOAACalculator+getUTCSunset0) ⇒ <code>number</code>
        * [.getUTCSeaLevelSunset(zenith)](#NOAACalculator+getUTCSeaLevelSunset) ⇒ <code>number</code>
        * [.getElevationAdjustment(elevation)](#NOAACalculator+getElevationAdjustment) ⇒ <code>number</code>
        * [.adjustZenith(zenith, elevation)](#NOAACalculator+adjustZenith) ⇒ <code>number</code>
        * [.getUTCSunrise(date, geoLocation, zenith, adjustForElevation)](#NOAACalculator+getUTCSunrise) ⇒
        * [.getUTCSunset(date, geoLocation, zenith, adjustForElevation)](#NOAACalculator+getUTCSunset) ⇒
        * [.getTemporalHour(startOfDay, endOfDay)](#NOAACalculator+getTemporalHour) ⇒ <code>number</code>
        * [.getSunTransit(startOfDay, endOfDay)](#NOAACalculator+getSunTransit) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getDateFromTime(time, isSunrise)](#NOAACalculator+getDateFromTime) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
    * _static_
        * [.CIVIL_ZENITH](#NOAACalculator.CIVIL_ZENITH)
        * [.NAUTICAL_ZENITH](#NOAACalculator.NAUTICAL_ZENITH)
        * [.ASTRONOMICAL_ZENITH](#NOAACalculator.ASTRONOMICAL_ZENITH)
        * [.getTimeOffset(time, offset)](#NOAACalculator.getTimeOffset) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getSolarElevation(date, lat, lon)](#NOAACalculator.getSolarElevation) ⇒ <code>number</code>
        * [.getSolarAzimuth(date, latitude, lon)](#NOAACalculator.getSolarAzimuth) ⇒ <code>number</code>

<a name="new_NOAACalculator_new"></a>

### new NOAACalculator(geoLocation, date)
A constructor that takes in <a href="http://en.wikipedia.org/wiki/Geolocation">geolocation</a> information as a
parameter.


| Param | Type | Description |
| --- | --- | --- |
| geoLocation | [<code>GeoLocation</code>](#GeoLocation) | The location information used for calculating astronomical sun times. |
| date | <code>Temporal.PlainDate</code> |  |

<a name="NOAACalculator+getSunrise"></a>

### noaaCalculator.getSunrise() ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
The getSunrise method Returns a `Date` representing the
[elevation adjusted](getElevationAdjustment) sunrise time. The zenith used
for the calculation uses [geometric zenith](GEOMETRIC_ZENITH) of 90&deg; plus
[getElevationAdjustment](getElevationAdjustment). This is adjusted
to add approximately 50/60 of a degree to account for 34 archminutes of refraction
and 16 archminutes for the sun's radius for a total of [90.83333&deg;](adjustZenith).

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - the `Date` representing the exact sunrise time. If the calculation can't be computed such as
        in the Arctic Circle where there is at least one day a year where the sun does not rise, and one where it
        does not set, a null will be returned. See detailed explanation on top of the page.  
**See**

- adjustZenith
- getSeaLevelSunrise()
- getUTCSunrise

<a name="NOAACalculator+getSeaLevelSunrise"></a>

### noaaCalculator.getSeaLevelSunrise() ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A method that returns the sunrise without [elevation
adjustment](getElevationAdjustment). Non-sunrise and sunset calculations such as dawn and dusk, depend on the amount of visible light,
something that is not affected by elevation. This method returns sunrise calculated at sea level. This forms the
base for dawn calculations that are calculated as a dip below the horizon before sunrise.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - the `Date` representing the exact sea-level sunrise time. If the calculation can't be computed
        such as in the Arctic Circle where there is at least one day a year where the sun does not rise, and one
        where it does not set, a null will be returned. See detailed explanation on top of the page.  
**See**

- getSunrise
- getUTCSeaLevelSunrise
- getSeaLevelSunset()

<a name="NOAACalculator+getBeginCivilTwilight"></a>

### noaaCalculator.getBeginCivilTwilight() ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A method that returns the beginning of civil twilight (dawn) using a zenith of [96&deg;](CIVIL_ZENITH).

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - The `Date` of the beginning of civil twilight using a zenith of 96&deg;. If the calculation
        can't be computed, null will be returned. See detailed explanation on top of the page.  
**See**: CIVIL_ZENITH  
<a name="NOAACalculator+getBeginNauticalTwilight"></a>

### noaaCalculator.getBeginNauticalTwilight() ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A method that returns the beginning of nautical twilight using a zenith of [102&deg;](NAUTICAL_ZENITH).

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - The `Date` of the beginning of nautical twilight using a zenith of 102&deg;. If the
        calculation can't be computed null will be returned. See detailed explanation on top of the page.  
**See**: NAUTICAL_ZENITH  
<a name="NOAACalculator+getBeginAstronomicalTwilight"></a>

### noaaCalculator.getBeginAstronomicalTwilight() ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A method that returns the beginning of astronomical twilight using a zenith of [108&deg;](ASTRONOMICAL_ZENITH).

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - The `Date` of the beginning of astronomical twilight using a zenith of 108&deg;. If the
        calculation can't be computed, null will be returned. See detailed explanation on top of the page.  
**See**: ASTRONOMICAL_ZENITH  
<a name="NOAACalculator+getSunset"></a>

### noaaCalculator.getSunset() ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
The getSunset method Returns a `Date` representing the
[elevation adjusted](getElevationAdjustment) sunset time. The zenith used for
the calculation uses [geometric zenith](GEOMETRIC_ZENITH) of 90&deg; plus
[getElevationAdjustment](getElevationAdjustment). This is adjusted
to add approximately 50/60 of a degree to account for 34 archminutes of refraction
and 16 archminutes for the sun's radius for a total of [90.83333&deg;](adjustZenith).
Note:
In certain cases the calculates sunset will occur before sunrise. This will typically happen when a timezone
other than the local timezone is used (calculating Los Angeles sunset using a GMT timezone for example). In this
case the sunset date will be incremented to the following date.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - The `Date` representing the exact sunset time. If the calculation can't be computed such as in
        the Arctic Circle where there is at least one day a year where the sun does not rise, and one where it
        does not set, a null will be returned. See detailed explanation on top of the page.  
**See**

- adjustZenith
- getSeaLevelSunset()
- getUTCSunset

<a name="NOAACalculator+getSeaLevelSunset"></a>

### noaaCalculator.getSeaLevelSunset() ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A method that returns the sunset without [elevation
adjustment](getElevationAdjustment). Non-sunrise and sunset calculations such as dawn and dusk, depend on the amount of visible light,
something that is not affected by elevation. This method returns sunset calculated at sea level. This forms the
base for dusk calculations that are calculated as a dip below the horizon after sunset.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - The `Date` representing the exact sea-level sunset time. If the calculation can't be computed
        such as in the Arctic Circle where there is at least one day a year where the sun does not rise, and one
        where it does not set, a null will be returned. See detailed explanation on top of the page.  
**See**

- getSunset
- getUTCSeaLevelSunset

<a name="NOAACalculator+getEndCivilTwilight"></a>

### noaaCalculator.getEndCivilTwilight() ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A method that returns the end of civil twilight using a zenith of [96&deg;](CIVIL_ZENITH).

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - The `Date` of the end of civil twilight using a zenith of [96&deg;](CIVIL_ZENITH). If
        the calculation can't be computed, null will be returned. See detailed explanation on top of the page.  
**See**: CIVIL_ZENITH  
<a name="NOAACalculator+getEndNauticalTwilight"></a>

### noaaCalculator.getEndNauticalTwilight() ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A method that returns the end of nautical twilight using a zenith of [102&deg;](NAUTICAL_ZENITH).

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - The `Date` of the end of nautical twilight using a zenith of [102&deg;](NAUTICAL_ZENITH)
        . If the calculation can't be computed, null will be returned. See detailed explanation on top of the
        page.  
**See**: NAUTICAL_ZENITH  
<a name="NOAACalculator+getEndAstronomicalTwilight"></a>

### noaaCalculator.getEndAstronomicalTwilight() ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A method that returns the end of astronomical twilight using a zenith of [108&deg;](ASTRONOMICAL_ZENITH).

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - The `Date` of the end of astronomical twilight using a zenith of [108&deg;](ASTRONOMICAL_ZENITH). If the calculation can't be computed, null will be returned. See detailed explanation on top
        of the page.  
**See**: ASTRONOMICAL_ZENITH  
<a name="NOAACalculator+getSunriseOffsetByDegrees"></a>

### noaaCalculator.getSunriseOffsetByDegrees(offsetZenith) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A utility method that returns the time of an offset by degrees below or above the horizon of
[sunrise](getSunrise()). Note that the degree offset is from the vertical, so for a calculation of 14&deg;
before sunrise, an offset of 14 + [GEOMETRIC_ZENITH](GEOMETRIC_ZENITH) = 104 would have to be passed as a parameter.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - The `Date` of the offset after (or before) [getSunrise](getSunrise). If the calculation
        can't be computed such as in the Arctic Circle where there is at least one day a year where the sun does
        not rise, and one where it does not set, a null will be returned. See detailed explanation on top of the
        page.  

| Param | Type | Description |
| --- | --- | --- |
| offsetZenith | <code>number</code> | the degrees before [getSunrise](getSunrise) to use in the calculation. For time after sunrise use            negative numbers. Note that the degree offset is from the vertical, so for a calculation of 14&deg;            before sunrise, an offset of 14 + [GEOMETRIC_ZENITH](GEOMETRIC_ZENITH) = 104 would have to be passed as a            parameter. |

<a name="NOAACalculator+getSunsetOffsetByDegrees"></a>

### noaaCalculator.getSunsetOffsetByDegrees(offsetZenith) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A utility method that returns the time of an offset by degrees below or above the horizon of [sunset](getSunset()). Note that the degree offset is from the vertical, so for a calculation of 14&deg; after sunset, an
offset of 14 + [GEOMETRIC_ZENITH](GEOMETRIC_ZENITH) = 104 would have to be passed as a parameter.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - The `Date`of the offset after (or before) [getSunset](getSunset). If the calculation can't
        be computed such as in the Arctic Circle where there is at least one day a year where the sun does not
        rise, and one where it does not set, a null will be returned. See detailed explanation on top of the
        page.  

| Param | Type | Description |
| --- | --- | --- |
| offsetZenith | <code>number</code> | the degrees after [getSunset](getSunset) to use in the calculation. For time before sunset use negative            numbers. Note that the degree offset is from the vertical, so for a calculation of 14&deg; after            sunset, an offset of 14 + [GEOMETRIC_ZENITH](GEOMETRIC_ZENITH) = 104 would have to be passed as a parameter. |

<a name="NOAACalculator+getUTCSunrise0"></a>

### noaaCalculator.getUTCSunrise0(zenith) ⇒ <code>number</code>
A method that returns the sunrise in UTC time without correction for time zone offset from GMT and without using
daylight savings time.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>number</code> - The time in the format: 18.75 for 18:45:00 UTC/GMT. If the calculation can't be computed such as in the
        Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
        not set, `NaN` will be returned. See detailed explanation on top of the page.  

| Param | Type | Description |
| --- | --- | --- |
| zenith | <code>number</code> | the degrees below the horizon. For time after sunrise use negative numbers. |

<a name="NOAACalculator+getUTCSeaLevelSunrise"></a>

### noaaCalculator.getUTCSeaLevelSunrise(zenith) ⇒ <code>number</code>
A method that returns the sunrise in UTC time without correction for time zone offset from GMT and without using
daylight savings time. Non-sunrise and sunset calculations such as dawn and dusk, depend on the amount of visible
light, something that is not affected by elevation. This method returns UTC sunrise calculated at sea level. This
forms the base for dawn calculations that are calculated as a dip below the horizon before sunrise.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>number</code> - The time in the format: 18.75 for 18:45:00 UTC/GMT. If the calculation can't be computed such as in the
        Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
        not set, `NaN` will be returned. See detailed explanation on top of the page.  
**See**

- getUTCSunrise
- getUTCSeaLevelSunset


| Param | Type | Description |
| --- | --- | --- |
| zenith | <code>number</code> | the degrees below the horizon. For time after sunrise use negative numbers. |

<a name="NOAACalculator+getUTCSunset0"></a>

### noaaCalculator.getUTCSunset0(zenith) ⇒ <code>number</code>
A method that returns the sunset in UTC time without correction for time zone offset from GMT and without using
daylight savings time.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>number</code> - The time in the format: 18.75 for 18:45:00 UTC/GMT. If the calculation can't be computed such as in the
        Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
        not set, `NaN` will be returned. See detailed explanation on top of the page.  
**See**: getUTCSeaLevelSunset  

| Param | Type | Description |
| --- | --- | --- |
| zenith | <code>number</code> | the degrees below the horizon. For time after sunset use negative numbers. |

<a name="NOAACalculator+getUTCSeaLevelSunset"></a>

### noaaCalculator.getUTCSeaLevelSunset(zenith) ⇒ <code>number</code>
A method that returns the sunset in UTC time without correction for elevation, time zone offset from GMT and
without using daylight savings time. Non-sunrise and sunset calculations such as dawn and dusk, depend on the
amount of visible light, something that is not affected by elevation. This method returns UTC sunset calculated
at sea level. This forms the base for dusk calculations that are calculated as a dip below the horizon after
sunset.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>number</code> - The time in the format: 18.75 for 18:45:00 UTC/GMT. If the calculation can't be computed such as in the
        Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
        not set, `NaN` will be returned. See detailed explanation on top of the page.  
**See**

- getUTCSunset
- getUTCSeaLevelSunrise


| Param | Type | Description |
| --- | --- | --- |
| zenith | <code>number</code> | the degrees below the horizon. For time before sunset use negative numbers. |

<a name="NOAACalculator+getElevationAdjustment"></a>

### noaaCalculator.getElevationAdjustment(elevation) ⇒ <code>number</code>
Method to return the adjustment to the zenith required to account for the elevation. Since a person at a higher
elevation can see farther below the horizon, the calculation for sunrise / sunset is calculated below the horizon
used at sea level. This is only used for sunrise and sunset and not times before or after it such as
[nautical twilight](getBeginNauticalTwilight()) since those
calculations are based on the level of available light at the given dip below the horizon, something that is not
affected by elevation, the adjustment should only made if the zenith == 90&deg; [adjusted](adjustZenith)
for refraction and solar radius. The algorithm used is

<pre>
elevationAdjustment = Math.toDegrees(Math.acos(earthRadiusInMeters / (earthRadiusInMeters + elevationMeters)));
</pre>

The source of this algorithm is <a href="http://www.calendarists.com">Calendrical Calculations</a> by Edward M.
Reingold and Nachum Dershowitz. An alternate algorithm that produces an almost identical (but not accurate)
result found in Ma'aglay Tzedek by Moishe Kosower and other sources is:

<pre>
elevationAdjustment = 0.0347 * Math.sqrt(elevationMeters);
</pre>

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>number</code> - the adjusted zenith  

| Param | Type | Description |
| --- | --- | --- |
| elevation | <code>number</code> | elevation in Meters. |

<a name="NOAACalculator+adjustZenith"></a>

### noaaCalculator.adjustZenith(zenith, elevation) ⇒ <code>number</code>
Adjusts the zenith of astronomical sunrise and sunset to account for solar refraction, solar radius and
elevation. The value for Sun's zenith and true rise/set Zenith (used in this class and subclasses) is the angle
that the center of the Sun makes to a line perpendicular to the Earth's surface. If the Sun were a point and the
Earth were without an atmosphere, true sunset and sunrise would correspond to a 90&deg; zenith. Because the Sun
is not a point, and because the atmosphere refracts light, this 90&deg; zenith does not, in fact, correspond to
true sunset or sunrise, instead the centre of the Sun's disk must lie just below the horizon for the upper edge
to be obscured. This means that a zenith of just above 90&deg; must be used. The Sun subtends an angle of 16
minutes of arc, and atmospheric refraction
accounts for 34 minutes or so, giving a total
of 50 arcminutes. The total value for ZENITH is 90+(5/6) or 90.8333333&deg; for true sunrise/sunset. Since a
person at an elevation can see blow the horizon of a person at sea level, this will also adjust the zenith to
account for elevation if available. Note that this will only adjust the value if the zenith is exactly 90 degrees.
For values below and above this no correction is done. As an example, astronomical twilight is when the sun is
18&deg; below the horizon or [108&deg;
below the zenith](ASTRONOMICAL_ZENITH). This is traditionally calculated with none of the above mentioned adjustments. The same goes
for various <em>tzais</em> and <em>alos</em> times such as the
[16.1&deg;](ZmanimCalendar#ZENITH_16_POINT_1) dip used in
[ComplexZmanimCalendar#getAlos16Point1Degrees](ComplexZmanimCalendar#getAlos16Point1Degrees).

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>number</code> - The zenith adjusted to include the sun's radius, refracton
        and [elevation](getElevationAdjustment) adjustment. This will only be adjusted for
        sunrise and sunset (if the zenith == 90&deg;)  
**See**: getElevationAdjustment  

| Param | Type | Description |
| --- | --- | --- |
| zenith | <code>number</code> | the azimuth below the vertical zenith of 90&deg;. For sunset typically the [zenith](adjustZenith) used for the calculation uses geometric zenith of 90&deg; and [adjusts](adjustZenith)            this slightly to account for solar refraction and the sun's radius. Another example would be            [getEndNauticalTwilight](getEndNauticalTwilight) that passes            [NAUTICAL_ZENITH](NAUTICAL_ZENITH) to this method. |
| elevation | <code>number</code> | elevation in Meters. |

<a name="NOAACalculator+getUTCSunrise"></a>

### noaaCalculator.getUTCSunrise(date, geoLocation, zenith, adjustForElevation) ⇒
A method that calculates UTC sunrise as well as any time based on an angle above or below sunrise.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: The UTC time of sunrise in 24 hour format. 5:45:00 AM will return 5.75.0. If an error was encountered in
        the calculation (expected behavior for some locations such as near the poles,
        `NaN` will be returned.  

| Param | Description |
| --- | --- |
| date | Used to calculate day of year. |
| geoLocation | The location information used for astronomical calculating sun times. |
| zenith | the azimuth below the vertical zenith of 90 degrees. for sunrise typically the [zenith](adjustZenith) used for the calculation uses geometric zenith of 90&deg; and [adjusts](adjustZenith)            this slightly to account for solar refraction and the sun's radius. Another example would be            [getBeginNauticalTwilight](getBeginNauticalTwilight) that passes            [NAUTICAL_ZENITH](NAUTICAL_ZENITH) to this method. |
| adjustForElevation | Should the time be adjusted for elevation |

<a name="NOAACalculator+getUTCSunset"></a>

### noaaCalculator.getUTCSunset(date, geoLocation, zenith, adjustForElevation) ⇒
A method that calculates UTC sunset as well as any time based on an angle above or below sunset.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: The UTC time of sunset in 24 hour format. 5:45:00 AM will return 5.75.0. If an error was encountered in
        the calculation (expected behavior for some locations such as near the poles,
        `NaN` will be returned.  

| Param | Description |
| --- | --- |
| date | Used to calculate day of year. |
| geoLocation | The location information used for astronomical calculating sun times. |
| zenith | the azimuth below the vertical zenith of 90&deg;. For sunset typically the [zenith](adjustZenith) used for the calculation uses geometric zenith of 90&deg; and [adjusts](adjustZenith)            this slightly to account for solar refraction and the sun's radius. Another example would be            [getEndNauticalTwilight](getEndNauticalTwilight) that passes            [NAUTICAL_ZENITH](NAUTICAL_ZENITH) to this method. |
| adjustForElevation | Should the time be adjusted for elevation |

<a name="NOAACalculator+getTemporalHour"></a>

### noaaCalculator.getTemporalHour(startOfDay, endOfDay) ⇒ <code>number</code>
A utility method that will allow the calculation of a temporal (solar) hour based on the sunrise and sunset
passed as parameters to this method. An example of the use of this method would be the calculation of a
non-elevation adjusted temporal hour by passing in [sea level sunrise](getSeaLevelSunrise()) and
[sea level sunset](getSeaLevelSunset()) as parameters.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>number</code> - the <code>long</code> millisecond length of the temporal hour. If the calculation can't be computed a
        `NaN` will be returned. See detailed explanation on top of the page.  
**See**: getTemporalHour()  

| Param | Type | Description |
| --- | --- | --- |
| startOfDay | <code>Temporal.ZonedDateTime</code> \| <code>null</code> | The start of the day. |
| endOfDay | <code>Temporal.ZonedDateTime</code> \| <code>null</code> | The end of the day. |

<a name="NOAACalculator+getSunTransit"></a>

### noaaCalculator.getSunTransit(startOfDay, endOfDay) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A method that returns sundial or solar noon. It occurs when the Sun is <a href
="http://en.wikipedia.org/wiki/Transit_%28astronomy%29">transiting</a> the <a
href="http://en.wikipedia.org/wiki/Meridian_%28astronomy%29">celestial meridian</a>. In this class it is
calculated as halfway between the sunrise and sunset passed to this method. This time can be slightly off the
real transit time due to changes in declination (the lengthening or shortening day).

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - The `Date` representing Sun's transit. If the calculation can't be computed such as in the
        Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
        not set, null will be returned. See detailed explanation on top of the page.  

| Param | Type | Description |
| --- | --- | --- |
| startOfDay | <code>Temporal.ZonedDateTime</code> \| <code>null</code> | the start of day for calculating the sun's transit. This can be sea level sunrise, visual sunrise (or            any arbitrary start of day) passed to this method. |
| endOfDay | <code>Temporal.ZonedDateTime</code> \| <code>null</code> | the end of day for calculating the sun's transit. This can be sea level sunset, visual sunset (or any            arbitrary end of day) passed to this method. |

<a name="NOAACalculator+getDateFromTime"></a>

### noaaCalculator.getDateFromTime(time, isSunrise) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A method that returns a `Date` from the time passed in as a parameter.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - The Date.  
**Access**: protected  

| Param | Type | Description |
| --- | --- | --- |
| time | <code>number</code> | The time to be set as the time for the `Date`. The time expected is in the format: 18.75            for 6:45:00 PM. |
| isSunrise | <code>boolean</code> | true if the time is sunrise, and false if it is sunset |

<a name="NOAACalculator.CIVIL_ZENITH"></a>

### NOAACalculator.CIVIL\_ZENITH
Sun's zenith at civil twilight (96&deg;).

**Kind**: static property of [<code>NOAACalculator</code>](#NOAACalculator)  
<a name="NOAACalculator.NAUTICAL_ZENITH"></a>

### NOAACalculator.NAUTICAL\_ZENITH
Sun's zenith at nautical twilight (102&deg;).

**Kind**: static property of [<code>NOAACalculator</code>](#NOAACalculator)  
<a name="NOAACalculator.ASTRONOMICAL_ZENITH"></a>

### NOAACalculator.ASTRONOMICAL\_ZENITH
Sun's zenith at astronomical twilight (108&deg;).

**Kind**: static property of [<code>NOAACalculator</code>](#NOAACalculator)  
<a name="NOAACalculator.getTimeOffset"></a>

### NOAACalculator.getTimeOffset(time, offset) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A utility method that returns a date offset by the offset time passed in. Please note that the level of light
during twilight is not affected by elevation, so if this is being used to calculate an offset before sunrise or
after sunset with the intent of getting a rough "level of light" calculation, the sunrise or sunset time passed
to this method should be sea level sunrise and sunset.

**Kind**: static method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - the `Date` with the offset in milliseconds added to it  

| Param | Type | Description |
| --- | --- | --- |
| time | <code>Temporal.ZonedDateTime</code> \| <code>null</code> | the start time |
| offset | <code>number</code> | the offset in milliseconds to add to the time. |

<a name="NOAACalculator.getSolarElevation"></a>

### NOAACalculator.getSolarElevation(date, lat, lon) ⇒ <code>number</code>
Return the <a href="http://en.wikipedia.org/wiki/Celestial_coordinate_system">Solar Elevation</a> for the
horizontal coordinate system at the given location at the given time. Can be negative if the sun is below the
horizon. Not corrected for altitude.

**Kind**: static method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>number</code> - solar elevation in degrees - horizon is 0 degrees, civil twilight is -6 degrees  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>Temporal.ZonedDateTime</code> | time of calculation |
| lat | <code>number</code> | latitude of location for calculation |
| lon | <code>number</code> | longitude of location for calculation |

<a name="NOAACalculator.getSolarAzimuth"></a>

### NOAACalculator.getSolarAzimuth(date, latitude, lon) ⇒ <code>number</code>
Return the <a href="http://en.wikipedia.org/wiki/Celestial_coordinate_system">Solar Azimuth</a> for the
horizontal coordinate system at the given location at the given time. Not corrected for altitude. True south is 0
degrees.

**Kind**: static method of [<code>NOAACalculator</code>](#NOAACalculator)  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>Temporal.ZonedDateTime</code> | time of calculation |
| latitude | <code>number</code> | latitude of location for calculation |
| lon | <code>number</code> | longitude of location for calculation |

