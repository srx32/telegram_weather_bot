import "dotenv/config";

const fetch = require("node-fetch");

import { Weather } from "../models/weather.model";
import { City } from "../models/city.model";

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

    // console.log(json);

    return json as Weather;
  } catch (error) {
    console.log(error);
  }

  //   fetch(OW_WEATHER_API + q)
  //     .then((result) => result.json())
  //     .then((json) => console.log(json))
  //     .catch((error) => console.log(error));
}

// API - max of 48 hours
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

    // console.log(json);

    return json as Weather;
  } catch (error) {
    console.log(error);
  }
}

// API - max of 8 days
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

    // console.log(json);

    return json as Weather;
  } catch (error) {
    console.log(error);
  }
}

async function getMatchingCities(cityName: string) {
  const q = `direct?q=${cityName}` + `&limit=5` + `&appid=${OW_API_KEY}`;

  try {
    const result = await fetch(OW_GEO_API + q);

    const json = await result.json();

    // console.log(json);

    return json as City[];
  } catch (error) {
    console.log(error);
  }
}

async function getCitiesByLocation(latitude: number, longitude: number) {
  const q =
    `reverse?lat=${latitude}&lon=${longitude}` +
    `&limit=5` +
    `&appid=${OW_API_KEY}`;

  try {
    const result = await fetch(OW_GEO_API + q);

    const json = await result.json();

    // console.log(json);

    return json as City[];
  } catch (error) {
    console.log(error);
  }
}

function getMatchingEmoji(icon_code: string) {
  if (icon_code === "01d" || icon_code === "01n") {
    return "☀️";
  }

  if (icon_code === "02d" || icon_code === "02n") {
    return "🌤️";
  }

  if (icon_code === "03d" || icon_code === "03n") {
    return "☁️";
  }

  if (icon_code === "04d" || icon_code === "04n") {
    return "🌥️";
  }

  if (icon_code === "09d" || icon_code === "09n") {
    return "🌧️";
  }

  if (icon_code === "10d" || icon_code === "10n") {
    return "🌦️";
  }

  if (icon_code === "11d" || icon_code === "11n") {
    return "🌩️";
  }

  if (icon_code === "13d" || icon_code === "13n") {
    return "❄️";
  }

  if (icon_code === "50d" || icon_code === "50n") {
    return "🌫️";
  }

  return "";
}

export {
  getCurrentWeather,
  getHourlyWeather,
  getDailyWeather,
  getMatchingCities,
  getCitiesByLocation,
  getMatchingEmoji,
};
