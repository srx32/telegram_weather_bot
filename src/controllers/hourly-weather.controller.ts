import { Composer, Markup } from "telegraf";
import { DateTime } from "luxon";

import { getHourlyWeather, getMatchingEmoji } from "../helpers/weather.helper";
import { HOURLY_MENU, WEATHER_MENU } from "../models/weather-menu.model";
import * as userSettingsHelper from "../helpers/user-settings.helper";
import { replyWithLocationMenu } from "../helpers/location.helper";

const hourlyWeatherController = new Composer();

hourlyWeatherController.action("hourly", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.editMessageReplyMarkup(
    Markup.inlineKeyboard(HOURLY_MENU).reply_markup
  );
});

hourlyWeatherController.action(/hourly-(\d+)/, async (ctx) => {
  try {
    const nbHours = Number(ctx.match[1]);

    console.log("Number of hours : " + nbHours);

    const userId = ctx.callbackQuery.from.id;
    const userSettings = await userSettingsHelper.get(userId);

    if (!userSettings) {
      await replyWithLocationMenu(ctx);

      return;
    }

    const weather = await getHourlyWeather(
      userSettings.location.latitude,
      userSettings.location.longitude
    );

    const hourlyForecast = weather?.hourly!;

    let weatherTextArray: string[] = [];
    hourlyForecast.forEach((hf, index) => {
      if (index < nbHours) {
        const dateTime = DateTime.fromSeconds(hf.dt).toFormat(
          "EEE d MMM 'à' HH':'mm",
          { locale: "fr" }
        );

        const weatherEmoji = getMatchingEmoji(hf.weather[0].icon);

        weatherTextArray.push(
          `<blockquote>${dateTime.toUpperCase()}</blockquote>` +
            `\n${weatherEmoji} ${hf.temp} °C` +
            `\n<b>${hf.weather[0].description.toUpperCase()}</b>` +
            `\n\n<span class="tg-spoiler">Précipitation : ${Number(
              hf.pop * 100
            ).toFixed(0)} %` +
            `\nHumidité : ${hf.humidity} %` +
            `\nVent : ${hf.wind_speed} m/s` +
            `\nTémpérature ressentie : ${hf.feels_like} °C</span>` +
            `\n\n`
        );
      }
    });

    let weatherText = "";
    let weatherTextPart1 = "";
    let weatherTextPart2 = "";
    if (weatherTextArray.length <= 24) {
      weatherText = weatherTextArray.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        ""
      );
    } else {
      weatherTextPart1 = weatherTextArray
        .slice(0, 25)
        .reduce((accumulator, currentValue) => accumulator + currentValue, "");
      weatherTextPart2 = weatherTextArray
        .slice(25)
        .reduce((accumulator, currentValue) => accumulator + currentValue, "");
    }

    await ctx.answerCbQuery();

    await ctx.deleteMessage();

    if (weatherTextArray.length <= 24) {
      await ctx.reply(
        `Here is the <b>hourly</b> weather of `.toUpperCase() +
          `\n<b>${userSettings.city}</b> : ` +
          ` \n\n${weatherText}`,
        {
          parse_mode: "HTML",
        }
      );
    } else {
      await ctx.reply(
        `Here is your <b>hourly</b> weather of `.toUpperCase() +
          `\n<b>${userSettings.city}</b> (PART 1) : ` +
          `\n\n${weatherTextPart1}`,
        {
          parse_mode: "HTML",
        }
      );

      await ctx.reply(
        `Here is your <b>hourly</b> weather of `.toUpperCase() +
          `\n<b>${userSettings.city}</b> (PART 2) : ` +
          `\n\n${weatherTextPart2}`,
        {
          parse_mode: "HTML",
        }
      );
    }

    await ctx.reply(
      "Want another weather forecast, make your selection : ",
      Markup.inlineKeyboard(WEATHER_MENU)
    );
  } catch (error) {
    console.error(error);
  }
});

export default hourlyWeatherController;
