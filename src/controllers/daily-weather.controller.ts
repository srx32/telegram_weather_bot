import { Composer, Markup } from "telegraf";
import { USER_SETTINGS } from "../models/user-settings.model";
import { getDailyWeather, getMatchingEmoji } from "../helpers/weather.helper";
import { DateTime } from "luxon";
import { DAILY_MENU, WEATHER_MENU } from "../models/weather-menu.model";

const dailyWeatherController = new Composer();

dailyWeatherController.action("daily", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.editMessageReplyMarkup(
    Markup.inlineKeyboard(DAILY_MENU).reply_markup
  );
});

dailyWeatherController.action(/daily-(\d+)/, async (ctx) => {
  const nbDays = Number(ctx.match[1]);

  console.log("Number of days : " + nbDays);

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

  const weather = await getDailyWeather(
    userSettings.location.latitude,
    userSettings.location.longitude
  );

  const dailyForecast = weather?.daily!;

  let weatherText = "";
  dailyForecast.forEach((hf, index) => {
    if (index < nbDays) {
      const dateTime = DateTime.fromSeconds(hf.dt).toFormat(
        "EEEE d MMMM yyyy",
        {
          locale: "fr",
        }
      );

      const weatherEmoji = getMatchingEmoji(hf.weather[0].icon);

      weatherText +=
        `<blockquote>${dateTime.toUpperCase()}</blockquote>` +
        `\n${weatherEmoji} ${hf.temp.morn} ~ ${hf.temp.night} °C` +
        `\n<b>${hf.weather[0].description.toUpperCase()}</b>` +
        `\n\n<span class="tg-spoiler">Précipitation : ${hf.pop * 100} %` +
        `\nHumidité : ${hf.humidity} %` +
        `\nVent : ${hf.wind_speed} m/s` +
        `\nTémpérature ressentie : ${hf.feels_like.morn} ~ ${hf.feels_like.night} °C</span>` +
        `\n\n`;
    }
  });

  await ctx.answerCbQuery();

  await ctx.deleteMessage();

  await ctx.reply(
    `Here is your <b>daily</b> weather:`.toUpperCase() + `\n\n${weatherText}`,
    {
      parse_mode: "HTML",
    }
  );

  await ctx.reply(
    "Want another weather forecast, make your selection : ",
    Markup.inlineKeyboard(WEATHER_MENU)
  );
});

export default dailyWeatherController;
