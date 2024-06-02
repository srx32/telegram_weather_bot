import { Composer, Markup } from "telegraf";
import { message } from "telegraf/filters";

import { LOCATION_MENU, WEATHER_MENU } from "../models/weather-menu.model";
import {
  getCitiesByLocation,
  getMatchingCities,
} from "../helpers/weather.helper";
import * as userSettingsHelper from "../helpers/user-settings.helper";

const locationController = new Composer();

let isCitySelected = false;

locationController.action("location", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.reply(
    "Waiting for coordinates...",
    Markup.keyboard([
      Markup.button.locationRequest("Tap here to send your location 🌍 📌"),
    ]).oneTime(true)
  );
});

locationController.action("city", async (ctx) => {
  isCitySelected = true;

  await ctx.answerCbQuery();

  await ctx.reply("Enter the name of the city : ");
});

locationController.on(message("location"), async (ctx) => {
  const location = ctx.message.location;

  console.log(location);

  const cities = await getCitiesByLocation(
    location.latitude,
    location.longitude
  );
  const city = cities![0];
  const cityFull =
    city.name + ", " + city.country + (city.state ? ", " + city.state : "");

  const chatId = ctx.chat.id;
  const userId = ctx.message.from.id;

  await userSettingsHelper.save({
    chatId: chatId,
    userId: userId,
    location: { latitude: location.latitude, longitude: location.longitude },
    city: cityFull,
  });

  await ctx.reply(`Coordinates received!`, Markup.removeKeyboard());

  await ctx.reply(
    `Now, select the type of weather forecast you want : `,
    Markup.inlineKeyboard(WEATHER_MENU)
  );
});

locationController.on(message("text"), async (ctx) => {
  if (!isCitySelected) {
    return;
  }

  isCitySelected = false;

  const matchingCities = await getMatchingCities(ctx.message.text);

  if (matchingCities) {
    if (matchingCities.length > 0) {
      // if(matchingCities.length === 1) {

      // }
      ctx.reply(
        "Please, make a choice between the list of matching cities : ",
        Markup.inlineKeyboard(
          matchingCities.map((city) => {
            const cityFull =
              city.name +
              ", " +
              city.country +
              (city.state ? ", " + city.state : "");

            return [
              {
                text: cityFull,
                callback_data:
                  "location=" +
                  String(city.lat + "_" + city.lon + "_" + cityFull),
              },
            ];
          })
        )
      );
    } else {
      ctx.reply("No city matches found!\nPlease, check the spelling.");
    }
  }
});

locationController.action(/location=(.+)/, async (ctx) => {
  const location = ctx.match[1];
  const locationSplit = location.split("_");
  const lat = Number(locationSplit[0]);
  const lon = Number(locationSplit[1]);
  const cityFull = String(locationSplit[2]);

  console.log(location);

  // const chatId = ctx.chat.id;
  const userId = ctx.callbackQuery.from.id;
  await userSettingsHelper.save({
    chatId: -1,
    userId: userId,
    location: { latitude: lat, longitude: lon },
    city: cityFull,
  });

  await ctx.answerCbQuery();

  await ctx.reply(
    `Now, select the type of weather forecast you want : `,
    Markup.inlineKeyboard(WEATHER_MENU)
  );

  //   await ctx.reply(`Coordinates received!`, Markup.removeKeyboard());

  //   await ctx.reply(
  //     `Now, select the type of weather forecast you want : `,
  //     Markup.inlineKeyboard(WEATHER_MENU)
  //   );
});

export default locationController;
