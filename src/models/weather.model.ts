export interface Weather {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current?: Current;
  hourly?: Hourly[];
  daily?: Daily[];
}

export interface Current {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  weather: WeatherDescription[];
}

export interface WeatherDescription {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Hourly {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: WeatherDescription[];
  pop: number;
  rain?: Rain;
}

export interface Rain {
  "1h": number;
}

export interface Daily {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  summary: string;
  temp: Temp;
  feels_like: FeelsLike;
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: WeatherDescription[];
  clouds: number;
  pop: number;
  uvi: number;
  rain?: number;
}

export interface Temp {
  morn: number;
  day: number;
  eve: number;
  night: number;
  min: number;
  max: number;
}

export interface FeelsLike {
  morn: number;
  day: number;
  eve: number;
  night: number;
}
