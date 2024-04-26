import "dotenv/config";

const fetch = require('node-fetch')

import { Weather } from "../models/weather.model";

const OW_API_KEY = String(process.env.OW_API_KEY);

const OW_WEATHER_API = String(process.env.OW_WEATHER_API);

const OW_GEO_API = String(process.env.OW_GEO_API);

async function getCurrentWeather(lat: number, lon: number) {
  const q =
    `lat=${lat}&lon=${lon}` +
    `&exclude=minutely,hourly,daily,alerts` +
    `&units=metric` +
    `&lang=fr` +
    `&appid=${OW_API_KEY}`;

  try {
    const result = await fetch(OW_WEATHER_API + q);

    const json = await result.json();

    console.log(json);

    return json as Weather;
  } catch (error) {
    console.log(error);
  }

  //   fetch(OW_WEATHER_API + q)
  //     .then((result) => result.json())
  //     .then((json) => console.log(json))
  //     .catch((error) => console.log(error));
}

async function getHourlyWeather(lat: number, lon: number) {
  const q =
    `lat=${lat}&lon=${lon}` +
    `&exclude=current,minutely,daily,alerts` +
    `&units=metric` +
    `&lang=fr` +
    `&appid=${OW_API_KEY}`;

  try {
    const result = await fetch(OW_WEATHER_API + q);

    const json = await result.json();

    console.log(json);

    return json as Weather;
  } catch (error) {
    console.log(error);
  }
}

async function getDailyWeather(lat: number, lon: number) {
  const q =
    `lat=${lat}&lon=${lon}` +
    `&exclude=current,minutely,hourly,alerts` +
    `&units=metric` +
    `&lang=fr` +
    `&appid=${OW_API_KEY}`;

  try {
    const result = await fetch(OW_WEATHER_API + q);

    const json = await result.json();

    console.log(json);

    return json as Weather;
  } catch (error) {
    console.log(error);
  }
}

function getMatchingCities(cityName: string) {}

export {
  getCurrentWeather,
  getHourlyWeather,
  getDailyWeather,
  getMatchingCities,
};
