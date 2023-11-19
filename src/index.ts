import {Temporal} from 'temporal-polyfill';

/**
 * java.lang.Math.toRadians
 * @param degrees
 */
function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * java.lang.Math.toDegrees
 * @param radians
 */
function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

const Long_MIN_VALUE = NaN;

/**
 * A class that contains location information such as latitude and longitude required for astronomical calculations. The
 * elevation field may not be used by some calculation engines and would be ignored if set. Check the documentation for
 * specific implementations of the {@link AstronomicalCalculator} to see if elevation is calculated as part of the
 * algorithm.
 *
 * @author &copy; Eliyahu Hershfeld 2004 - 2016
 * @version 1.1
 */
export class GeoLocation {
  /**
   * @see #getLatitude()
   * @see #setLatitude(double)
   * @see #setLatitude(int, int, double, String)
   */
  private latitude!: number;

  /**
   * @see #getLongitude()
   * @see #setLongitude(double)
   * @see #setLongitude(int, int, double, String)
   */
  private longitude!: number;

  /**
   * @see #getLocationName()
   * @see #setLocationName(String)
   */
  private locationName: string | null = null;

  /**
   * @see #getTimeZone()
   * @see #setTimeZone(TimeZone)
   */
  private timeZoneId!: string;

  /**
   * @see #getElevation()
   * @see #setElevation(double)
   */
  private elevation!: number;

  /**
   * Method to get the elevation in Meters.
   *
   * @return Returns the elevation in Meters.
   */
  public getElevation(): number {
    return this.elevation;
  }

  /**
   * Method to set the elevation in Meters <b>above </b> sea level.
   *
   * @param elevation
   *            The elevation to set in Meters. An IllegalArgumentException will be thrown if the value is a negative.
   */
  public setElevation(elevation: number): void {
    this.elevation = elevation;
  }

  /**
   * GeoLocation constructor with parameters for all required fields.
   *
   * @param name
   *            The location name for display use such as &quot;Lakewood, NJ&quot;
   * @param latitude
   *            the latitude in a double format such as 40.095965 for Lakewood, NJ.
   *            <b>Note: </b> For latitudes south of the equator, a negative value should be used.
   * @param longitude
   *            double the longitude in a double format such as -74.222130 for Lakewood, NJ.
   *            <b>Note: </b> For longitudes east of the <a href="http://en.wikipedia.org/wiki/Prime_Meridian">Prime
   *            Meridian </a> (Greenwich), a negative value should be used.
   * @param elevation
   *            the elevation above sea level in Meters. Elevation is not used in most algorithms used for calculating
   *            sunrise and set.
   * @param timeZoneId
   *            the <code>TimeZone</code> for the location.
   */
  constructor(
    name: string | null,
    latitude: number,
    longitude: number,
    elevation: number,
    timeZoneId?: string
  );
  constructor(
    name: string | null,
    latitude: number,
    longitude: number,
    timeZoneId: string
  );
  constructor();
  constructor(
    name: string | null = 'Greenwich, England',
    latitude = 51.4772,
    longitude = 0,
    elevationOrTimeZoneId?: number | string,
    timeZoneId?: string
  ) {
    let elevation = 0;
    if (timeZoneId) {
      elevation = elevationOrTimeZoneId as number;
    } else {
      timeZoneId = elevationOrTimeZoneId as string;
    }

    this.setLocationName(name);
    this.setLatitude(latitude);
    this.setLongitude(longitude);
    this.setElevation(elevation);
    this.setTimeZone(timeZoneId);
  }

  public setLatitude(latitude: number): void {
    this.latitude = latitude;
  }

  /**
   * @return Returns the latitude.
   */
  public getLatitude(): number {
    return this.latitude;
  }

  public setLongitude(longitude: number): void {
    this.longitude = longitude;
  }

  /**
   * @return Returns the longitude.
   */
  public getLongitude(): number {
    return this.longitude;
  }

  /**
   * @return Returns the location name.
   */
  public getLocationName(): string | null {
    return this.locationName;
  }

  /**
   * @param name
   *            The setter method for the display name.
   */
  public setLocationName(name: string | null): void {
    this.locationName = name;
  }

  /**
   * @return Returns the timeZone.
   */
  public getTimeZone(): string {
    return this.timeZoneId;
  }

  /**
   * Method to set the TimeZone. If this is ever set after the GeoLocation is set in the
   * {@link AstronomicalCalendar}, it is critical that
   * {@link AstronomicalCalendar#getCalendar()}.
   * {@link java.util.Calendar#setTimeZone(TimeZone) setTimeZone(TimeZone)} be called in order for the
   * AstronomicalCalendar to output times in the expected offset. This situation will arise if the
   * AstronomicalCalendar is ever {@link AstronomicalCalendar#clone() cloned}.
   *
   * @param timeZone
   *            The timeZone to set.
   */
  public setTimeZone(timeZoneId: string): void {
    this.timeZoneId = timeZoneId;
  }
}

/**
 * The commonly used average solar refraction. Calendrical Calculations lists a more accurate global average of
 * 34.478885263888294
 */
const refraction: number = 34 / 60;
// private double refraction = 34.478885263888294 / 60d;

/**
 * The commonly used average solar radius in minutes of a degree.
 */
const solarRadius: number = 16 / 60;

/**
 * The commonly used average earth radius in KM. At this time, this only affects elevation adjustment and not the
 * sunrise and sunset calculations. The value currently defaults to 6356.9 KM.
 */
const earthRadius = 6356.9; // in KM

/**
 * Implementation of sunrise and sunset methods to calculate astronomical times based on the <a
 * href="http://noaa.gov">NOAA</a> algorithm. This calculator uses the Java algorithm based on the implementation by <a
 * href="http://noaa.gov">NOAA - National Oceanic and Atmospheric Administration</a>'s <a href =
 * "http://www.srrb.noaa.gov/highlights/sunrise/sunrise.html">Surface Radiation Research Branch</a>. NOAA's <a
 * href="http://www.srrb.noaa.gov/highlights/sunrise/solareqns.PDF">implementation</a> is based on equations from <a
 * href="http://www.willbell.com/math/mc1.htm">Astronomical Algorithms</a> by <a
 * href="http://en.wikipedia.org/wiki/Jean_Meeus">Jean Meeus</a>. Added to the algorithm is an adjustment of the zenith
 * to account for elevation. The algorithm can be found in the <a
 * href="http://en.wikipedia.org/wiki/Sunrise_equation">Wikipedia Sunrise Equation</a> article.
 *
 * @author &copy; Eliyahu Hershfeld 2011 - 2019
 */
export class NOAACalculator {
  /**
   * The zenith of astronomical sunrise and sunset. The sun is 90&deg; from the vertical 0&deg;
   */
  private static readonly GEOMETRIC_ZENITH: number = 90;

  /**
   * Default value for Sun's zenith and true rise/set Zenith (used in this class and subclasses) is the angle that the
   * center of the Sun makes to a line perpendicular to the Earth's surface. If the Sun were a point and the Earth
   * were without an atmosphere, true sunset and sunrise would correspond to a 90&deg; zenith. Because the Sun is not
   * a point, and because the atmosphere refracts light, this 90&deg; zenith does not, in fact, correspond to true
   * sunset or sunrise, instead the center of the Sun's disk must lie just below the horizon for the upper edge to be
   * obscured. This means that a zenith of just above 90&deg; must be used. The Sun subtends an angle of 16 minutes of
   * arc (this can be changed via the {@link #setSunRadius(double)} method , and atmospheric refraction accounts for
   * 34 minutes or so (this can be changed via the {@link #setRefraction(double)} method), giving a total of 50
   * arcminutes. The total value for ZENITH is 90+(5/6) or 90.8333333&deg; for true sunrise/sunset.
   */
  // const ZENITH: number = GEOMETRIC_ZENITH + 5.0 / 6.0;

  /** Sun's zenith at civil twilight (96&deg;). */
  public static readonly CIVIL_ZENITH: number = 96;

  /** Sun's zenith at nautical twilight (102&deg;). */
  public static readonly NAUTICAL_ZENITH: number = 102;

  /** Sun's zenith at astronomical twilight (108&deg;). */
  public static readonly ASTRONOMICAL_ZENITH: number = 108;

  /**
   * The Java Calendar encapsulated by this class to track the current date used by the class
   */
  private date!: Temporal.PlainDate;

  /**
   * the {@link GeoLocation} used for calculations.
   */
  private geoLocation!: GeoLocation;
  /**
   * The getSunrise method Returns a <code>Date</code> representing the
   * {@link AstronomicalCalculator#getElevationAdjustment(double) elevation adjusted} sunrise time. The zenith used
   * for the calculation uses {@link #GEOMETRIC_ZENITH geometric zenith} of 90&deg; plus
   * {@link AstronomicalCalculator#getElevationAdjustment(double)}. This is adjusted by the
   * {@link AstronomicalCalculator} to add approximately 50/60 of a degree to account for 34 archminutes of refraction
   * and 16 archminutes for the sun's radius for a total of {@link AstronomicalCalculator#adjustZenith 90.83333&deg;}.
   * See documentation for the specific implementation of the {@link AstronomicalCalculator} that you are using.
   *
   * @return the <code>Date</code> representing the exact sunrise time. If the calculation can't be computed such as
   *         in the Arctic Circle where there is at least one day a year where the sun does not rise, and one where it
   *         does not set, a null will be returned. See detailed explanation on top of the page.
   * @see AstronomicalCalculator#adjustZenith
   * @see #getSeaLevelSunrise()
   * @see AstronomicalCalendar#getUTCSunrise
   */
  public getSunrise(): Temporal.ZonedDateTime | null {
    const sunrise: number = this.getUTCSunrise0(
      NOAACalculator.GEOMETRIC_ZENITH
    );
    if (Number.isNaN(sunrise)) return null;
    return this.getDateFromTime(sunrise, true);
  }

  /**
   * A method that returns the sunrise without {@link AstronomicalCalculator#getElevationAdjustment(double) elevation
   * adjustment}. Non-sunrise and sunset calculations such as dawn and dusk, depend on the amount of visible light,
   * something that is not affected by elevation. This method returns sunrise calculated at sea level. This forms the
   * base for dawn calculations that are calculated as a dip below the horizon before sunrise.
   *
   * @return the <code>Date</code> representing the exact sea-level sunrise time. If the calculation can't be computed
   *         such as in the Arctic Circle where there is at least one day a year where the sun does not rise, and one
   *         where it does not set, a null will be returned. See detailed explanation on top of the page.
   * @see AstronomicalCalendar#getSunrise
   * @see AstronomicalCalendar#getUTCSeaLevelSunrise
   * @see #getSeaLevelSunset()
   */
  public getSeaLevelSunrise(): Temporal.ZonedDateTime | null {
    const sunrise: number = this.getUTCSeaLevelSunrise(
      NOAACalculator.GEOMETRIC_ZENITH
    );
    if (Number.isNaN(sunrise)) return null;
    return this.getDateFromTime(sunrise, true);
  }

  /**
   * A method that returns the beginning of civil twilight (dawn) using a zenith of {@link #CIVIL_ZENITH 96&deg;}.
   *
   * @return The <code>Date</code> of the beginning of civil twilight using a zenith of 96&deg;. If the calculation
   *         can't be computed, null will be returned. See detailed explanation on top of the page.
   * @see #CIVIL_ZENITH
   */
  public getBeginCivilTwilight(): Temporal.ZonedDateTime | null {
    return this.getSunriseOffsetByDegrees(NOAACalculator.CIVIL_ZENITH);
  }

  /**
   * A method that returns the beginning of nautical twilight using a zenith of {@link #NAUTICAL_ZENITH 102&deg;}.
   *
   * @return The <code>Date</code> of the beginning of nautical twilight using a zenith of 102&deg;. If the
   *         calculation can't be computed null will be returned. See detailed explanation on top of the page.
   * @see #NAUTICAL_ZENITH
   */
  public getBeginNauticalTwilight(): Temporal.ZonedDateTime | null {
    return this.getSunriseOffsetByDegrees(NOAACalculator.NAUTICAL_ZENITH);
  }

  /**
   * A method that returns the beginning of astronomical twilight using a zenith of {@link #ASTRONOMICAL_ZENITH
   * 108&deg;}.
   *
   * @return The <code>Date</code> of the beginning of astronomical twilight using a zenith of 108&deg;. If the
   *         calculation can't be computed, null will be returned. See detailed explanation on top of the page.
   * @see #ASTRONOMICAL_ZENITH
   */
  public getBeginAstronomicalTwilight(): Temporal.ZonedDateTime | null {
    return this.getSunriseOffsetByDegrees(NOAACalculator.ASTRONOMICAL_ZENITH);
  }

  /**
   * The getSunset method Returns a <code>Date</code> representing the
   * {@link AstronomicalCalculator#getElevationAdjustment(double) elevation adjusted} sunset time. The zenith used for
   * the calculation uses {@link #GEOMETRIC_ZENITH geometric zenith} of 90&deg; plus
   * {@link AstronomicalCalculator#getElevationAdjustment(double)}. This is adjusted by the
   * {@link AstronomicalCalculator} to add approximately 50/60 of a degree to account for 34 archminutes of refraction
   * and 16 archminutes for the sun's radius for a total of {@link AstronomicalCalculator#adjustZenith 90.83333&deg;}.
   * See documentation for the specific implementation of the {@link AstronomicalCalculator} that you are using. Note:
   * In certain cases the calculates sunset will occur before sunrise. This will typically happen when a timezone
   * other than the local timezone is used (calculating Los Angeles sunset using a GMT timezone for example). In this
   * case the sunset date will be incremented to the following date.
   *
   * @return the <code>Date</code> representing the exact sunset time. If the calculation can't be computed such as in
   *         the Arctic Circle where there is at least one day a year where the sun does not rise, and one where it
   *         does not set, a null will be returned. See detailed explanation on top of the page.
   * @see AstronomicalCalculator#adjustZenith
   * @see #getSeaLevelSunset()
   * @see AstronomicalCalendar#getUTCSunset
   */
  public getSunset(): Temporal.ZonedDateTime | null {
    const sunset: number = this.getUTCSunset0(NOAACalculator.GEOMETRIC_ZENITH);
    if (Number.isNaN(sunset)) return null;
    return this.getDateFromTime(sunset, false);
  }

  /**
   * A method that returns the sunset without {@link AstronomicalCalculator#getElevationAdjustment(double) elevation
   * adjustment}. Non-sunrise and sunset calculations such as dawn and dusk, depend on the amount of visible light,
   * something that is not affected by elevation. This method returns sunset calculated at sea level. This forms the
   * base for dusk calculations that are calculated as a dip below the horizon after sunset.
   *
   * @return the <code>Date</code> representing the exact sea-level sunset time. If the calculation can't be computed
   *         such as in the Arctic Circle where there is at least one day a year where the sun does not rise, and one
   *         where it does not set, a null will be returned. See detailed explanation on top of the page.
   * @see AstronomicalCalendar#getSunset
   * @see AstronomicalCalendar#getUTCSeaLevelSunset 2see {@link #getSunset()}
   */
  public getSeaLevelSunset(): Temporal.ZonedDateTime | null {
    const sunset: number = this.getUTCSeaLevelSunset(
      NOAACalculator.GEOMETRIC_ZENITH
    );
    if (Number.isNaN(sunset)) return null;
    return this.getDateFromTime(sunset, false);
  }

  /**
   * A method that returns the end of civil twilight using a zenith of {@link #CIVIL_ZENITH 96&deg;}.
   *
   * @return The <code>Date</code> of the end of civil twilight using a zenith of {@link #CIVIL_ZENITH 96&deg;}. If
   *         the calculation can't be computed, null will be returned. See detailed explanation on top of the page.
   * @see #CIVIL_ZENITH
   */
  public getEndCivilTwilight(): Temporal.ZonedDateTime | null {
    return this.getSunsetOffsetByDegrees(NOAACalculator.CIVIL_ZENITH);
  }

  /**
   * A method that returns the end of nautical twilight using a zenith of {@link #NAUTICAL_ZENITH 102&deg;}.
   *
   * @return The <code>Date</code> of the end of nautical twilight using a zenith of {@link #NAUTICAL_ZENITH 102&deg;}
   *         . If the calculation can't be computed, null will be returned. See detailed explanation on top of the
   *         page.
   * @see #NAUTICAL_ZENITH
   */
  public getEndNauticalTwilight(): Temporal.ZonedDateTime | null {
    return this.getSunsetOffsetByDegrees(NOAACalculator.NAUTICAL_ZENITH);
  }

  /**
   * A method that returns the end of astronomical twilight using a zenith of {@link #ASTRONOMICAL_ZENITH 108&deg;}.
   *
   * @return the <code>Date</code> of the end of astronomical twilight using a zenith of {@link #ASTRONOMICAL_ZENITH
   *         108&deg;}. If the calculation can't be computed, null will be returned. See detailed explanation on top
   *         of the page.
   * @see #ASTRONOMICAL_ZENITH
   */
  public getEndAstronomicalTwilight(): Temporal.ZonedDateTime | null {
    return this.getSunsetOffsetByDegrees(NOAACalculator.ASTRONOMICAL_ZENITH);
  }

  /**
   * A utility method that returns a date offset by the offset time passed in. Please note that the level of light
   * during twilight is not affected by elevation, so if this is being used to calculate an offset before sunrise or
   * after sunset with the intent of getting a rough "level of light" calculation, the sunrise or sunset time passed
   * to this method should be sea level sunrise and sunset.
   *
   * @param time
   *            the start time
   * @param offset
   *            the offset in milliseconds to add to the time.
   * @return the {@link java.util.Date} with the offset in milliseconds added to it
   */
  public static getTimeOffset(
    time: Temporal.ZonedDateTime | null,
    offset: number
  ): Temporal.ZonedDateTime | null {
    if (time === null || offset === Long_MIN_VALUE || Number.isNaN(offset)) {
      return null;
    }

    return time.add({milliseconds: offset});
  }

  /**
   * A utility method that returns the time of an offset by degrees below or above the horizon of
   * {@link #getSunrise() sunrise}. Note that the degree offset is from the vertical, so for a calculation of 14&deg;
   * before sunrise, an offset of 14 + {@link #GEOMETRIC_ZENITH} = 104 would have to be passed as a parameter.
   *
   * @param offsetZenith
   *            the degrees before {@link #getSunrise()} to use in the calculation. For time after sunrise use
   *            negative numbers. Note that the degree offset is from the vertical, so for a calculation of 14&deg;
   *            before sunrise, an offset of 14 + {@link #GEOMETRIC_ZENITH} = 104 would have to be passed as a
   *            parameter.
   * @return The {@link java.util.Date} of the offset after (or before) {@link #getSunrise()}. If the calculation
   *         can't be computed such as in the Arctic Circle where there is at least one day a year where the sun does
   *         not rise, and one where it does not set, a null will be returned. See detailed explanation on top of the
   *         page.
   */
  public getSunriseOffsetByDegrees(
    offsetZenith: number
  ): Temporal.ZonedDateTime | null {
    const dawn: number = this.getUTCSunrise0(offsetZenith);
    if (Number.isNaN(dawn)) return null;
    return this.getDateFromTime(dawn, true);
  }

  /**
   * A utility method that returns the time of an offset by degrees below or above the horizon of {@link #getSunset()
   * sunset}. Note that the degree offset is from the vertical, so for a calculation of 14&deg; after sunset, an
   * offset of 14 + {@link #GEOMETRIC_ZENITH} = 104 would have to be passed as a parameter.
   *
   * @param offsetZenith
   *            the degrees after {@link #getSunset()} to use in the calculation. For time before sunset use negative
   *            numbers. Note that the degree offset is from the vertical, so for a calculation of 14&deg; after
   *            sunset, an offset of 14 + {@link #GEOMETRIC_ZENITH} = 104 would have to be passed as a parameter.
   * @return The {@link java.util.Date}of the offset after (or before) {@link #getSunset()}. If the calculation can't
   *         be computed such as in the Arctic Circle where there is at least one day a year where the sun does not
   *         rise, and one where it does not set, a null will be returned. See detailed explanation on top of the
   *         page.
   */
  public getSunsetOffsetByDegrees(
    offsetZenith: number
  ): Temporal.ZonedDateTime | null {
    const sunset: number = this.getUTCSunset0(offsetZenith);
    if (Number.isNaN(sunset)) return null;
    return this.getDateFromTime(sunset, false);
  }

  /**
   * A constructor that takes in <a href="http://en.wikipedia.org/wiki/Geolocation">geolocation</a> information as a
   * parameter. The default {@link AstronomicalCalculator#getDefault() AstronomicalCalculator} used for solar
   * calculations is the the {@link NOAACalculator}.
   *
   * @param geoLocation
   *            The location information used for calculating astronomical sun times.
   *
   * @see #setAstronomicalCalculator(AstronomicalCalculator) for changing the calculator class.
   */
  constructor(geoLocation: GeoLocation, date: Temporal.PlainDate) {
    this.date = date;
    this.geoLocation = geoLocation;
  }

  /**
   * A method that returns the sunrise in UTC time without correction for time zone offset from GMT and without using
   * daylight savings time.
   *
   * @param zenith
   *            the degrees below the horizon. For time after sunrise use negative numbers.
   * @return The time in the format: 18.75 for 18:45:00 UTC/GMT. If the calculation can't be computed such as in the
   *         Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
   *         not set, {@link Double#NaN} will be returned. See detailed explanation on top of the page.
   */
  public getUTCSunrise0(zenith: number): number {
    return this.getUTCSunrise(
      this.getAdjustedDate(),
      this.geoLocation,
      zenith,
      true
    );
  }

  /**
   * A method that returns the sunrise in UTC time without correction for time zone offset from GMT and without using
   * daylight savings time. Non-sunrise and sunset calculations such as dawn and dusk, depend on the amount of visible
   * light, something that is not affected by elevation. This method returns UTC sunrise calculated at sea level. This
   * forms the base for dawn calculations that are calculated as a dip below the horizon before sunrise.
   *
   * @param zenith
   *            the degrees below the horizon. For time after sunrise use negative numbers.
   * @return The time in the format: 18.75 for 18:45:00 UTC/GMT. If the calculation can't be computed such as in the
   *         Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
   *         not set, {@link Double#NaN} will be returned. See detailed explanation on top of the page.
   * @see AstronomicalCalendar#getUTCSunrise
   * @see AstronomicalCalendar#getUTCSeaLevelSunset
   */
  public getUTCSeaLevelSunrise(zenith: number): number {
    return this.getUTCSunrise(
      this.getAdjustedDate(),
      this.geoLocation,
      zenith,
      false
    );
  }

  /**
   * A method that returns the sunset in UTC time without correction for time zone offset from GMT and without using
   * daylight savings time.
   *
   * @param zenith
   *            the degrees below the horizon. For time after sunset use negative numbers.
   * @return The time in the format: 18.75 for 18:45:00 UTC/GMT. If the calculation can't be computed such as in the
   *         Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
   *         not set, {@link Double#NaN} will be returned. See detailed explanation on top of the page.
   * @see AstronomicalCalendar#getUTCSeaLevelSunset
   */
  public getUTCSunset0(zenith: number): number {
    return this.getUTCSunset(
      this.getAdjustedDate(),
      this.geoLocation,
      zenith,
      true
    );
  }

  /**
   * A method that returns the sunset in UTC time without correction for elevation, time zone offset from GMT and
   * without using daylight savings time. Non-sunrise and sunset calculations such as dawn and dusk, depend on the
   * amount of visible light, something that is not affected by elevation. This method returns UTC sunset calculated
   * at sea level. This forms the base for dusk calculations that are calculated as a dip below the horizon after
   * sunset.
   *
   * @param zenith
   *            the degrees below the horizon. For time before sunset use negative numbers.
   * @return The time in the format: 18.75 for 18:45:00 UTC/GMT. If the calculation can't be computed such as in the
   *         Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
   *         not set, {@link Double#NaN} will be returned. See detailed explanation on top of the page.
   * @see AstronomicalCalendar#getUTCSunset
   * @see AstronomicalCalendar#getUTCSeaLevelSunrise
   */
  public getUTCSeaLevelSunset(zenith: number): number {
    return this.getUTCSunset(
      this.getAdjustedDate(),
      this.geoLocation,
      zenith,
      false
    );
  }

  /**
   * Adjusts the <code>Calendar</code> to deal with edge cases where the location crosses the antimeridian.
   *
   * @see GeoLocation#getAntimeridianAdjustment()
   * @return the adjusted Calendar
   */
  private getAdjustedDate(): Temporal.PlainDate {
    return this.date;
  }

  /**
   * Method to return the adjustment to the zenith required to account for the elevation. Since a person at a higher
   * elevation can see farther below the horizon, the calculation for sunrise / sunset is calculated below the horizon
   * used at sea level. This is only used for sunrise and sunset and not times before or after it such as
   * {@link AstronomicalCalendar#getBeginNauticalTwilight() nautical twilight} since those
   * calculations are based on the level of available light at the given dip below the horizon, something that is not
   * affected by elevation, the adjustment should only made if the zenith == 90&deg; {@link #adjustZenith adjusted}
   * for refraction and solar radius. The algorithm used is
   *
   * <pre>
   * elevationAdjustment = Math.toDegrees(Math.acos(earthRadiusInMeters / (earthRadiusInMeters + elevationMeters)));
   * </pre>
   *
   * The source of this algorithm is <a href="http://www.calendarists.com">Calendrical Calculations</a> by Edward M.
   * Reingold and Nachum Dershowitz. An alternate algorithm that produces an almost identical (but not accurate)
   * result found in Ma'aglay Tzedek by Moishe Kosower and other sources is:
   *
   * <pre>
   * elevationAdjustment = 0.0347 * Math.sqrt(elevationMeters);
   * </pre>
   *
   * @param elevation
   *            elevation in Meters.
   * @return the adjusted zenith
   */
  public getElevationAdjustment(elevation: number): number {
    // double elevationAdjustment = 0.0347 * Math.sqrt(elevation);
    const elevationAdjustment: number = radiansToDegrees(
      Math.acos(earthRadius / (earthRadius + elevation / 1000))
    );
    return elevationAdjustment;
  }

  /**
   * Adjusts the zenith of astronomical sunrise and sunset to account for solar refraction, solar radius and
   * elevation. The value for Sun's zenith and true rise/set Zenith (used in this class and subclasses) is the angle
   * that the center of the Sun makes to a line perpendicular to the Earth's surface. If the Sun were a point and the
   * Earth were without an atmosphere, true sunset and sunrise would correspond to a 90&deg; zenith. Because the Sun
   * is not a point, and because the atmosphere refracts light, this 90&deg; zenith does not, in fact, correspond to
   * true sunset or sunrise, instead the centre of the Sun's disk must lie just below the horizon for the upper edge
   * to be obscured. This means that a zenith of just above 90&deg; must be used. The Sun subtends an angle of 16
   * minutes of arc (this can be changed via the {@link #setSolarRadius(double)} method , and atmospheric refraction
   * accounts for 34 minutes or so (this can be changed via the {@link #setRefraction(double)} method), giving a total
   * of 50 arcminutes. The total value for ZENITH is 90+(5/6) or 90.8333333&deg; for true sunrise/sunset. Since a
   * person at an elevation can see blow the horizon of a person at sea level, this will also adjust the zenith to
   * account for elevation if available. Note that this will only adjust the value if the zenith is exactly 90 degrees.
   * For values below and above this no correction is done. As an example, astronomical twilight is when the sun is
   * 18&deg; below the horizon or {@link AstronomicalCalendar#ASTRONOMICAL_ZENITH 108&deg;
   * below the zenith}. This is traditionally calculated with none of the above mentioned adjustments. The same goes
   * for various <em>tzais</em> and <em>alos</em> times such as the
   * {@link ZmanimCalendar#ZENITH_16_POINT_1 16.1&deg;} dip used in
   * {@link ComplexZmanimCalendar#getAlos16Point1Degrees()}.
   *
   * @param zenith
   *            the azimuth below the vertical zenith of 90&deg;. For sunset typically the {@link #adjustZenith
   *            zenith} used for the calculation uses geometric zenith of 90&deg; and {@link #adjustZenith adjusts}
   *            this slightly to account for solar refraction and the sun's radius. Another example would be
   *            {@link AstronomicalCalendar#getEndNauticalTwilight()} that passes
   *            {@link AstronomicalCalendar#NAUTICAL_ZENITH} to this method.
   * @param elevation
   *            elevation in Meters.
   * @return The zenith adjusted to include the {@link #getSolarRadius sun's radius}, {@link #getRefraction
   *         refraction} and {@link #getElevationAdjustment elevation} adjustment. This will only be adjusted for
   *         sunrise and sunset (if the zenith == 90&deg;)
   * @see #getElevationAdjustment(double)
   */
  public adjustZenith(zenith: number, elevation: number) {
    let adjustedZenith: number = zenith;
    if (zenith === NOAACalculator.GEOMETRIC_ZENITH) {
      // only adjust if it is exactly sunrise or sunset
      adjustedZenith =
        zenith +
        (solarRadius + refraction + this.getElevationAdjustment(elevation));
    }
    return adjustedZenith;
  }

  /**
   * The <a href="http://en.wikipedia.org/wiki/Julian_day">Julian day</a> of January 1, 2000
   */
  private static readonly JULIAN_DAY_JAN_1_2000: number = 2451545;

  /**
   * Julian days per century
   */
  private static readonly JULIAN_DAYS_PER_CENTURY: number = 36525;

  /**
   * @see AstronomicalCalculator#getUTCSunrise(Calendar, GeoLocation, double, boolean)
   */
  public getUTCSunrise(
    date: Temporal.PlainDate,
    geoLocation: GeoLocation,
    zenith: number,
    adjustForElevation: boolean
  ): number {
    const elevation: number = adjustForElevation
      ? geoLocation.getElevation()
      : 0;
    const adjustedZenith: number = this.adjustZenith(zenith, elevation);

    let sunrise: number = NOAACalculator.getSunriseUTC(
      NOAACalculator.getJulianDay(date),
      geoLocation.getLatitude(),
      -geoLocation.getLongitude(),
      adjustedZenith
    );
    sunrise = sunrise / 60;

    // ensure that the time is >= 0 and < 24
    while (sunrise < 0) {
      sunrise += 24;
    }
    while (sunrise >= 24) {
      sunrise -= 24;
    }
    return sunrise;
  }

  /**
   * @see AstronomicalCalculator#getUTCSunset(Calendar, GeoLocation, double, boolean)
   */
  public getUTCSunset(
    date: Temporal.PlainDate,
    geoLocation: GeoLocation,
    zenith: number,
    adjustForElevation: boolean
  ): number {
    const elevation: number = adjustForElevation
      ? geoLocation.getElevation()
      : 0;
    const adjustedZenith: number = this.adjustZenith(zenith, elevation);

    let sunset: number = NOAACalculator.getSunsetUTC(
      NOAACalculator.getJulianDay(date),
      geoLocation.getLatitude(),
      -geoLocation.getLongitude(),
      adjustedZenith
    );
    sunset = sunset / 60;

    // ensure that the time is >= 0 and < 24
    while (sunset < 0) {
      sunset += 24;
    }
    while (sunset >= 24) {
      sunset -= 24;
    }
    return sunset;
  }

  /**
   * A utility method that will allow the calculation of a temporal (solar) hour based on the sunrise and sunset
   * passed as parameters to this method. An example of the use of this method would be the calculation of a
   * non-elevation adjusted temporal hour by passing in {@link #getSeaLevelSunrise() sea level sunrise} and
   * {@link #getSeaLevelSunset() sea level sunset} as parameters.
   *
   * @param startOfday
   *            The start of the day.
   * @param endOfDay
   *            The end of the day.
   *
   * @return the <code>long</code> millisecond length of the temporal hour. If the calculation can't be computed a
   *         {@link Long#MIN_VALUE} will be returned. See detailed explanation on top of the page.
   *
   * @see #getTemporalHour()
   */
  public getTemporalHour(
    startOfday: Temporal.ZonedDateTime | null = this.getSeaLevelSunrise(),
    endOfDay: Temporal.ZonedDateTime | null = this.getSeaLevelSunset()
  ): number {
    if (startOfday === null || endOfDay === null) {
      return Long_MIN_VALUE;
    }
    return (endOfDay.valueOf() - startOfday.valueOf()) / 12;
  }

  /**
   * A method that returns sundial or solar noon. It occurs when the Sun is <a href
   * ="http://en.wikipedia.org/wiki/Transit_%28astronomy%29">transiting</a> the <a
   * href="http://en.wikipedia.org/wiki/Meridian_%28astronomy%29">celestial meridian</a>. In this class it is
   * calculated as halfway between the sunrise and sunset passed to this method. This time can be slightly off the
   * real transit time due to changes in declination (the lengthening or shortening day).
   *
   * @param startOfDay
   *            the start of day for calculating the sun's transit. This can be sea level sunrise, visual sunrise (or
   *            any arbitrary start of day) passed to this method.
   * @param endOfDay
   *            the end of day for calculating the sun's transit. This can be sea level sunset, visual sunset (or any
   *            arbitrary end of day) passed to this method.
   *
   * @return the <code>Date</code> representing Sun's transit. If the calculation can't be computed such as in the
   *         Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
   *         not set, null will be returned. See detailed explanation on top of the page.
   */
  public getSunTransit(
    startOfDay: Temporal.ZonedDateTime | null = this.getSeaLevelSunrise(),
    endOfDay: Temporal.ZonedDateTime | null = this.getSeaLevelSunset()
  ): Temporal.ZonedDateTime | null {
    const temporalHour: number = this.getTemporalHour(startOfDay, endOfDay);
    return NOAACalculator.getTimeOffset(startOfDay, temporalHour * 6);
  }

  /**
   * A method that returns a <code>Date</code> from the time passed in as a parameter.
   *
   * @param time
   *            The time to be set as the time for the <code>Date</code>. The time expected is in the format: 18.75
   *            for 6:45:00 PM.
   * @param isSunrise true if the time is sunrise, and false if it is sunset
   * @return The Date.
   */
  protected getDateFromTime(
    time: number,
    isSunrise: boolean
  ): Temporal.ZonedDateTime | null {
    if (Number.isNaN(time)) {
      return null;
    }
    let calculatedTime: number = time;

    let cal = this.getAdjustedDate();
    //    let cal = new Temporal.PlainDate(adj.year, adj.month, adj.day);

    const hours: number = Math.trunc(calculatedTime); // retain only the hours
    calculatedTime -= hours;
    const minutes: number = Math.trunc((calculatedTime *= 60)); // retain only the minutes
    calculatedTime -= minutes;
    const seconds: number = Math.trunc((calculatedTime *= 60)); // retain only the seconds
    calculatedTime -= seconds; // remaining milliseconds

    // Check if a date transition has occurred, or is about to occur - this indicates the date of the event is
    // actually not the target date, but the day prior or after
    const localTimeHours: number = Math.trunc(
      this.geoLocation.getLongitude() / 15
    );
    if (isSunrise && localTimeHours + hours > 18) {
      cal = cal.add({days: -1});
      //      cal = cal.minus({days: 1});
    } else if (!isSunrise && localTimeHours + hours < 6) {
      cal = cal.add({days: 1});
    }

    return cal
      .toZonedDateTime({
        timeZone: 'UTC',
        plainTime: new Temporal.PlainTime(
          hours,
          minutes,
          seconds,
          Math.trunc(calculatedTime * 1000)
        ),
      })
      .withTimeZone(this.geoLocation.getTimeZone());
  }

  /**
   * Return the <a href="http://en.wikipedia.org/wiki/Julian_day">Julian day</a> from a Java Calendar
   *
   * @param calendar
   *            The Java Calendar
   * @return the Julian day corresponding to the date Note: Number is returned for start of day. Fractional days
   *         should be added later.
   */
  private static getJulianDay(date: Temporal.PlainDate): number {
    let {year, month} = date;
    const {day} = date;
    if (month <= 2) {
      year -= 1;
      month += 12;
    }
    const a: number = Math.trunc(year / 100);
    const b: number = Math.trunc(2 - a + a / 4);

    return (
      Math.floor(365.25 * (year + 4716)) +
      Math.floor(30.6001 * (month + 1)) +
      day +
      b -
      1524.5
    );
  }

  /**
   * Convert <a href="http://en.wikipedia.org/wiki/Julian_day">Julian day</a> to centuries since J2000.0.
   *
   * @param julianDay
   *            the Julian Day to convert
   * @return the centuries since 2000 Julian corresponding to the Julian Day
   */
  private static getJulianCenturiesFromJulianDay(julianDay: number): number {
    return (
      (julianDay - NOAACalculator.JULIAN_DAY_JAN_1_2000) /
      NOAACalculator.JULIAN_DAYS_PER_CENTURY
    );
  }

  /**
   * Convert centuries since J2000.0 to <a href="http://en.wikipedia.org/wiki/Julian_day">Julian day</a>.
   *
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return the Julian Day corresponding to the Julian centuries passed in
   */
  private static getJulianDayFromJulianCenturies(
    julianCenturies: number
  ): number {
    return (
      julianCenturies * NOAACalculator.JULIAN_DAYS_PER_CENTURY +
      NOAACalculator.JULIAN_DAY_JAN_1_2000
    );
  }

  /**
   * Returns the Geometric <a href="http://en.wikipedia.org/wiki/Mean_longitude">Mean Longitude</a> of the Sun.
   *
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return the Geometric Mean Longitude of the Sun in degrees
   */
  private static getSunGeometricMeanLongitude(julianCenturies: number): number {
    let longitude: number =
      280.46646 + julianCenturies * (36000.76983 + 0.0003032 * julianCenturies);
    while (longitude > 360) {
      longitude -= 360;
    }
    while (longitude < 0) {
      longitude += 360;
    }

    return longitude; // in degrees
  }

  /**
   * Returns the Geometric <a href="http://en.wikipedia.org/wiki/Mean_anomaly">Mean Anomaly</a> of the Sun.
   *
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return the Geometric Mean Anomaly of the Sun in degrees
   */
  private static getSunGeometricMeanAnomaly(julianCenturies: number): number {
    return (
      357.52911 + julianCenturies * (35999.05029 - 0.0001537 * julianCenturies)
    ); // in degrees
  }

  /**
   * Return the <a href="http://en.wikipedia.org/wiki/Eccentricity_%28orbit%29">eccentricity of earth's orbit</a>.
   *
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return the unitless eccentricity
   */
  private static getEarthOrbitEccentricity(julianCenturies: number): number {
    return (
      0.016708634 -
      julianCenturies * (0.000042037 + 0.0000001267 * julianCenturies)
    ); // unitless
  }

  /**
   * Returns the <a href="http://en.wikipedia.org/wiki/Equation_of_the_center">equation of center</a> for the sun.
   *
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return the equation of center for the sun in degrees
   */
  private static getSunEquationOfCenter(julianCenturies: number): number {
    const m: number =
      NOAACalculator.getSunGeometricMeanAnomaly(julianCenturies);

    const mrad: number = degreesToRadians(m);
    const sinm: number = Math.sin(mrad);
    const sin2m: number = Math.sin(mrad + mrad);
    const sin3m: number = Math.sin(mrad + mrad + mrad);

    return (
      sinm *
        (1.914602 - julianCenturies * (0.004817 + 0.000014 * julianCenturies)) +
      sin2m * (0.019993 - 0.000101 * julianCenturies) +
      sin3m * 0.000289
    ); // in degrees
  }

  /**
   * Return the true longitude of the sun
   *
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return the sun's true longitude in degrees
   */
  private static getSunTrueLongitude(julianCenturies: number): number {
    const sunLongitude: number =
      NOAACalculator.getSunGeometricMeanLongitude(julianCenturies);
    const center: number =
      NOAACalculator.getSunEquationOfCenter(julianCenturies);

    return sunLongitude + center; // in degrees
  }

  // /**
  // * Returns the <a href="http://en.wikipedia.org/wiki/True_anomaly">true anamoly</a> of the sun.
  // *
  // * @param julianCenturies
  // * the number of Julian centuries since J2000.0
  // * @return the sun's true anamoly in degrees
  // */
  // private static double getSunTrueAnomaly(double julianCenturies) {
  // double meanAnomaly = getSunGeometricMeanAnomaly(julianCenturies);
  // double equationOfCenter = getSunEquationOfCenter(julianCenturies);
  //
  // return meanAnomaly + equationOfCenter; // in degrees
  // }

  /**
   * Return the apparent longitude of the sun
   *
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return sun's apparent longitude in degrees
   */
  private static getSunApparentLongitude(julianCenturies: number): number {
    const sunTrueLongitude: number =
      NOAACalculator.getSunTrueLongitude(julianCenturies);

    const omega: number = 125.04 - 1934.136 * julianCenturies;
    const lambda: number =
      sunTrueLongitude - 0.00569 - 0.00478 * Math.sin(degreesToRadians(omega));
    return lambda; // in degrees
  }

  /**
   * Returns the mean <a href="http://en.wikipedia.org/wiki/Axial_tilt">obliquity of the ecliptic</a> (Axial tilt).
   *
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return the mean obliquity in degrees
   */
  private static getMeanObliquityOfEcliptic(julianCenturies: number): number {
    const seconds: number =
      21.448 -
      julianCenturies *
        (46.815 + julianCenturies * (0.00059 - julianCenturies * 0.001813));
    return 23 + (26 + seconds / 60) / 60; // in degrees
  }

  /**
   * Returns the corrected <a href="http://en.wikipedia.org/wiki/Axial_tilt">obliquity of the ecliptic</a> (Axial
   * tilt).
   *
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return the corrected obliquity in degrees
   */
  private static getObliquityCorrection(julianCenturies: number): number {
    const obliquityOfEcliptic: number =
      NOAACalculator.getMeanObliquityOfEcliptic(julianCenturies);

    const omega: number = 125.04 - 1934.136 * julianCenturies;
    return obliquityOfEcliptic + 0.00256 * Math.cos(degreesToRadians(omega)); // in degrees
  }

  /**
   * Return the <a href="http://en.wikipedia.org/wiki/Declination">declination</a> of the sun.
   *
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return
   *            the sun's declination in degrees
   */
  private static getSunDeclination(julianCenturies: number): number {
    const obliquityCorrection: number =
      NOAACalculator.getObliquityCorrection(julianCenturies);
    const lambda: number =
      NOAACalculator.getSunApparentLongitude(julianCenturies);

    const sint: number =
      Math.sin(degreesToRadians(obliquityCorrection)) *
      Math.sin(degreesToRadians(lambda));
    const theta: number = radiansToDegrees(Math.asin(sint));
    return theta; // in degrees
  }

  /**
   * Return the <a href="http://en.wikipedia.org/wiki/Equation_of_time">Equation of Time</a> - the difference between
   * true solar time and mean solar time
   *
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return equation of time in minutes of time
   */
  private static getEquationOfTime(julianCenturies: number): number {
    const epsilon: number =
      NOAACalculator.getObliquityCorrection(julianCenturies);
    const geomMeanLongSun: number =
      NOAACalculator.getSunGeometricMeanLongitude(julianCenturies);
    const eccentricityEarthOrbit: number =
      NOAACalculator.getEarthOrbitEccentricity(julianCenturies);
    const geomMeanAnomalySun: number =
      NOAACalculator.getSunGeometricMeanAnomaly(julianCenturies);

    let y: number = Math.tan(degreesToRadians(epsilon) / 2);
    y *= y;

    const sin2l0: number = Math.sin(2 * degreesToRadians(geomMeanLongSun));
    const sinm: number = Math.sin(degreesToRadians(geomMeanAnomalySun));
    const cos2l0: number = Math.cos(2 * degreesToRadians(geomMeanLongSun));
    const sin4l0: number = Math.sin(4 * degreesToRadians(geomMeanLongSun));
    const sin2m: number = Math.sin(2 * degreesToRadians(geomMeanAnomalySun));

    const equationOfTime: number =
      y * sin2l0 -
      2 * eccentricityEarthOrbit * sinm +
      4 * eccentricityEarthOrbit * y * sinm * cos2l0 -
      0.5 * y * y * sin4l0 -
      1.25 * eccentricityEarthOrbit * eccentricityEarthOrbit * sin2m;
    return radiansToDegrees(equationOfTime) * 4; // in minutes of time
  }

  /**
   * Return the <a href="http://en.wikipedia.org/wiki/Hour_angle">hour angle</a> of the sun at sunrise for the
   * latitude.
   *
   * @param lat
   *            , the latitude of observer in degrees
   * @param solarDec
   *            the declination angle of sun in degrees
   * @param zenith
   *            the zenith
   * @return hour angle of sunrise in radians
   */
  private static getSunHourAngleAtSunrise(
    lat: number,
    solarDec: number,
    zenith: number
  ): number {
    const latRad: number = degreesToRadians(lat);
    const sdRad: number = degreesToRadians(solarDec);

    return Math.acos(
      Math.cos(degreesToRadians(zenith)) /
        (Math.cos(latRad) * Math.cos(sdRad)) -
        Math.tan(latRad) * Math.tan(sdRad)
    ); // in radians
  }

  /**
   * Returns the <a href="http://en.wikipedia.org/wiki/Hour_angle">hour angle</a> of the sun at sunset for the
   * latitude. TODO: use - {@link #getSunHourAngleAtSunrise(double, double, double)} implementation to avoid
   * duplication of code.
   *
   * @param lat
   *            the latitude of observer in degrees
   * @param solarDec
   *            the declination angle of sun in degrees
   * @param zenith
   *            the zenith
   * @return the hour angle of sunset in radians
   */
  private static getSunHourAngleAtSunset(
    lat: number,
    solarDec: number,
    zenith: number
  ): number {
    const latRad: number = degreesToRadians(lat);
    const sdRad: number = degreesToRadians(solarDec);

    const hourAngle: number = Math.acos(
      Math.cos(degreesToRadians(zenith)) /
        (Math.cos(latRad) * Math.cos(sdRad)) -
        Math.tan(latRad) * Math.tan(sdRad)
    );
    return -hourAngle; // in radians
  }

  /**
   * Return the <a href="http://en.wikipedia.org/wiki/Celestial_coordinate_system">Solar Elevation</a> for the
   * horizontal coordinate system at the given location at the given time. Can be negative if the sun is below the
   * horizon. Not corrected for altitude.
   *
   * @param cal
   *            time of calculation
   * @param lat
   *            latitude of location for calculation
   * @param lon
   *            longitude of location for calculation
   * @return solar elevation in degrees - horizon is 0 degrees, civil twilight is -6 degrees
   */
  public static getSolarElevation(
    date: Temporal.ZonedDateTime,
    lat: number,
    lon: number
  ): number {
    const julianDay: number = NOAACalculator.getJulianDay(date.toPlainDate());
    const julianCenturies: number =
      NOAACalculator.getJulianCenturiesFromJulianDay(julianDay);

    const equationOfTime: number =
      NOAACalculator.getEquationOfTime(julianCenturies);

    let longitude: number =
      date.hour + 12 + (date.minute + equationOfTime + date.second / 60) / 60;

    longitude = -((longitude * 360) / 24) % 360;
    const hourAngleRad: number = degreesToRadians(lon - longitude);
    const declination: number =
      NOAACalculator.getSunDeclination(julianCenturies);
    const decRad: number = degreesToRadians(declination);
    const latRad: number = degreesToRadians(lat);
    return radiansToDegrees(
      Math.asin(
        Math.sin(latRad) * Math.sin(decRad) +
          Math.cos(latRad) * Math.cos(decRad) * Math.cos(hourAngleRad)
      )
    );
  }

  /**
   * Return the <a href="http://en.wikipedia.org/wiki/Celestial_coordinate_system">Solar Azimuth</a> for the
   * horizontal coordinate system at the given location at the given time. Not corrected for altitude. True south is 0
   * degrees.
   *
   * @param cal
   *            time of calculation
   * @param latitude
   *            latitude of location for calculation
   * @param lon
   *            longitude of location for calculation
   * @return FIXME
   */
  public static getSolarAzimuth(
    date: Temporal.ZonedDateTime,
    latitude: number,
    lon: number
  ): number {
    const julianDay: number = NOAACalculator.getJulianDay(date.toPlainDate());
    const julianCenturies: number =
      NOAACalculator.getJulianCenturiesFromJulianDay(julianDay);

    const equationOfTime: number =
      NOAACalculator.getEquationOfTime(julianCenturies);

    let longitude: number =
      date.hour + 12 + (date.minute + equationOfTime + date.second / 60) / 60;

    longitude = -((longitude * 360) / 24) % 360;
    const hourAngleRad: number = degreesToRadians(lon - longitude);
    const declination: number =
      NOAACalculator.getSunDeclination(julianCenturies);
    const decRad: number = degreesToRadians(declination);
    const latRad: number = degreesToRadians(latitude);

    return (
      radiansToDegrees(
        Math.atan(
          Math.sin(hourAngleRad) /
            (Math.cos(hourAngleRad) * Math.sin(latRad) -
              Math.tan(decRad) * Math.cos(latRad))
        )
      ) + 180
    );
  }

  /**
   * Return the <a href="http://en.wikipedia.org/wiki/Universal_Coordinated_Time">Universal Coordinated Time</a> (UTC)
   * of sunrise for the given day at the given location on earth
   *
   * @param julianDay
   *            the Julian day
   * @param latitude
   *            the latitude of observer in degrees
   * @param longitude
   *            the longitude of observer in degrees
   * @param zenith
   *            the zenith
   * @return the time in minutes from zero UTC
   */
  private static getSunriseUTC(
    julianDay: number,
    latitude: number,
    longitude: number,
    zenith: number
  ): number {
    const julianCenturies: number =
      NOAACalculator.getJulianCenturiesFromJulianDay(julianDay);

    // Find the time of solar noon at the location, and use that declination. This is better than start of the
    // Julian day

    const noonmin: number = NOAACalculator.getSolarNoonUTC(
      julianCenturies,
      longitude
    );
    const tnoon: number = NOAACalculator.getJulianCenturiesFromJulianDay(
      julianDay + noonmin / 1440
    );

    // First pass to approximate sunrise (using solar noon)

    let eqTime: number = NOAACalculator.getEquationOfTime(tnoon);
    let solarDec: number = NOAACalculator.getSunDeclination(tnoon);
    let hourAngle: number = NOAACalculator.getSunHourAngleAtSunrise(
      latitude,
      solarDec,
      zenith
    );

    let delta: number = longitude - radiansToDegrees(hourAngle);
    let timeDiff: number = 4 * delta; // in minutes of time
    let timeUTC: number = 720 + timeDiff - eqTime; // in minutes

    // Second pass includes fractional Julian Day in gamma calc

    const newt: number = NOAACalculator.getJulianCenturiesFromJulianDay(
      NOAACalculator.getJulianDayFromJulianCenturies(julianCenturies) +
        timeUTC / 1440
    );
    eqTime = NOAACalculator.getEquationOfTime(newt);
    solarDec = NOAACalculator.getSunDeclination(newt);
    hourAngle = NOAACalculator.getSunHourAngleAtSunrise(
      latitude,
      solarDec,
      zenith
    );
    delta = longitude - radiansToDegrees(hourAngle);
    timeDiff = 4 * delta;
    timeUTC = 720 + timeDiff - eqTime; // in minutes
    return timeUTC;
  }

  /**
   * Return the <a href="http://en.wikipedia.org/wiki/Universal_Coordinated_Time">Universal Coordinated Time</a> (UTC)
   * of <a href="http://en.wikipedia.org/wiki/Noon#Solar_noon">solar noon</a> for the given day at the given location
   * on earth.
   *
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @param longitude
   *            the longitude of observer in degrees
   * @return the time in minutes from zero UTC
   */
  private static getSolarNoonUTC(
    julianCenturies: number,
    longitude: number
  ): number {
    // First pass uses approximate solar noon to calculate eqtime
    const tnoon: number = NOAACalculator.getJulianCenturiesFromJulianDay(
      NOAACalculator.getJulianDayFromJulianCenturies(julianCenturies) +
        longitude / 360
    );
    let eqTime: number = NOAACalculator.getEquationOfTime(tnoon);
    const solNoonUTC: number = 720 + longitude * 4 - eqTime; // min

    const newt: number = NOAACalculator.getJulianCenturiesFromJulianDay(
      NOAACalculator.getJulianDayFromJulianCenturies(julianCenturies) -
        0.5 +
        solNoonUTC / 1440
    );

    eqTime = NOAACalculator.getEquationOfTime(newt);
    return 720 + longitude * 4 - eqTime; // min
  }

  /**
   * Return the <a href="http://en.wikipedia.org/wiki/Universal_Coordinated_Time">Universal Coordinated Time</a> (UTC)
   * of sunset for the given day at the given location on earth
   *
   * @param julianDay
   *            the Julian day
   * @param latitude
   *            the latitude of observer in degrees
   * @param longitude
   *            : longitude of observer in degrees
   * @param zenith
   *            the zenith
   * @return the time in minutes from zero Universal Coordinated Time (UTC)
   */
  private static getSunsetUTC(
    julianDay: number,
    latitude: number,
    longitude: number,
    zenith: number
  ): number {
    const julianCenturies: number =
      NOAACalculator.getJulianCenturiesFromJulianDay(julianDay);

    // Find the time of solar noon at the location, and use that declination. This is better than start of the
    // Julian day

    const noonmin: number = NOAACalculator.getSolarNoonUTC(
      julianCenturies,
      longitude
    );
    const tnoon: number = NOAACalculator.getJulianCenturiesFromJulianDay(
      julianDay + noonmin / 1440
    );

    // First calculates sunrise and approx length of day

    let eqTime: number = NOAACalculator.getEquationOfTime(tnoon);
    let solarDec: number = NOAACalculator.getSunDeclination(tnoon);
    let hourAngle: number = NOAACalculator.getSunHourAngleAtSunset(
      latitude,
      solarDec,
      zenith
    );

    let delta: number = longitude - radiansToDegrees(hourAngle);
    let timeDiff: number = 4 * delta;
    let timeUTC: number = 720 + timeDiff - eqTime;

    // Second pass includes fractional Julian Day in gamma calc

    const newt: number = NOAACalculator.getJulianCenturiesFromJulianDay(
      NOAACalculator.getJulianDayFromJulianCenturies(julianCenturies) +
        timeUTC / 1440
    );
    eqTime = NOAACalculator.getEquationOfTime(newt);
    solarDec = NOAACalculator.getSunDeclination(newt);
    hourAngle = NOAACalculator.getSunHourAngleAtSunset(
      latitude,
      solarDec,
      zenith
    );

    delta = longitude - radiansToDegrees(hourAngle);
    timeDiff = 4 * delta;
    timeUTC = 720 + timeDiff - eqTime; // in minutes
    return timeUTC;
  }
}
