import { Composer, Markup } from "telegraf";
import { USER_SETTINGS } from "../models/user-settings.model";
import { getCurrentWeather, getMatchingEmoji } from "../helpers/weather.helper";
import { DateTime } from "luxon";
import { WEATHER_MENU } from "../models/weather-menu.model";

const currentWeatherController = new Composer();

currentWeatherController.action("current", async (ctx) => {
  const userSettings = USER_SETTINGS.find(
    (userSettings) => userSettings.userId === ctx.callbackQuery.from.id
  );

  if (!userSettings) {
    ctx.reply(
      `Please resend your location`,
      Markup.keyboard([
        Markup.button.locationRequest("Tap here to send your location 🌍 📌"),
      ]).oneTime(true)
    );
    return;
  }

  const weather = await getCurrentWeather(
    userSettings.location.latitude,
    userSettings.location.longitude
  );

  const currentWeather = weather?.current!;

  const dateTime = DateTime.fromSeconds(currentWeather.dt).toFormat(
    "EEE d MMM 'à' HH':'mm",
    { locale: "fr" }
  );

  const weatherEmoji = getMatchingEmoji(currentWeather.weather[0].icon);

  const weatherText =
    `<blockquote>${dateTime.toUpperCase()}</blockquote>` +
    `\n${weatherEmoji} ${currentWeather.temp} °C` +
    `\n<b>${currentWeather.weather[0].description.toUpperCase()}</b>` +
    `\n\n`;

  await ctx.answerCbQuery();

  await ctx.deleteMessage();

  await ctx.reply(`Here is your current weather: \n\n${weatherText}`, {
    parse_mode: "HTML",
  });

  await ctx.reply(
    "Want another weather forecast, make your selection : ",
    Markup.inlineKeyboard(WEATHER_MENU)
  );
});

export default currentWeatherController;
