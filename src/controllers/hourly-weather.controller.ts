import { Composer, Markup } from "telegraf";
import { USER_SETTINGS } from "../models/user-settings.model";
import { getHourlyWeather, getMatchingEmoji } from "./weather.controller";
import { DateTime } from "luxon";
import { HOURLY_MENU } from "../models/weather-menu.model";

const hourlyWeatherController = new Composer();

hourlyWeatherController.action("hourly", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.editMessageReplyMarkup({
    inline_keyboard: HOURLY_MENU,
  });
});

hourlyWeatherController.action(/hourly-(\d+)/, async (ctx) => {
  const nbHours = Number(ctx.match[1]);

  console.log("Number of hours : " + nbHours);

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

  const weather = await getHourlyWeather(
    userSettings.location.latitude,
    userSettings.location.longitude
  );

  const hourlyForecast = weather?.hourly!;

  let weatherText = "";
  hourlyForecast.forEach((hf, index) => {
    if (index < nbHours) {
      const dateTime = DateTime.fromSeconds(hf.dt).toFormat(
        "EEE d MMM 'à' HH':'mm",
        { locale: "fr" }
      );

      const weatherEmoji = getMatchingEmoji(hf.weather[0].icon);

      weatherText +=
        `<blockquote>${dateTime.toUpperCase()}</blockquote>` +
        `\n${weatherEmoji} ${hf.temp} °C` +
        `\n<b>${hf.weather[0].description.toUpperCase()}</b>` +
        `\n\n`;
    }
  });

  await ctx.answerCbQuery();

  await ctx.reply(`Here is your hourly weather: \n\n${weatherText}`, {
    parse_mode: "HTML",
  });
});

export default hourlyWeatherController;
