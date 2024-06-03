import { Composer, Markup } from "telegraf";

import { LOCATION_MENU, WEATHER_MENU } from "../models/weather-menu.model";
import * as userSettingsHelper from "../helpers/user-settings.helper";

const commandController = new Composer();

commandController.start(async (ctx) => {
  await ctx.telegram.sendMessage(
    ctx.message.chat.id,
    `Hello ${ctx.message.from.first_name}
      
  Thanks for using my 🐉 weather bot
  
  Press or enter /help to get the list of commands.
  `
  );
});

commandController.help(async (ctx) => {
  await ctx.telegram.sendMessage(
    ctx.message.chat.id,
    `To get you started :
  
  1 - First, we'll need your location (GPS or city-country you live in).
  
  2 - Second, you'll select the type of weather forecast you want.
  
  3 - And finally, we'll display the data to you.
  
  Sounds good ? Then, let's go!
  
  Smash or enter /setup to start.
    `
  );
});

commandController.command("setup", async (ctx) => {
  await ctx.reply(
    "First, we need your location.\nYou can send your location or send the city name :",
    Markup.inlineKeyboard(LOCATION_MENU)
  );

  // Markup.keyboard([
  //   Markup.button.locationRequest("Tap here to send your location 🌍 📌"),
  // ]).oneTime(true)
});

commandController.command("settings", async (ctx) => {
  const userId = ctx.message.from.id;
  const userSettings = await userSettingsHelper.get(userId);

  if (!userSettings) {
    ctx.reply(
      `You haven't set your settings, yet. Do you want to set them, now ?`,
      Markup.inlineKeyboard([
        [
          {
            text: "✅ Yes",
            callback_data: "yes_settings",
          },
          {
            text: "❌ No",
            callback_data: "no_settings",
          },
        ],
      ])
    );
    return;
  }

  await ctx.reply(
    "Here are your settings : " +
      "\n\nCity : " +
      "<b>" +
      userSettings.city +
      "</b>" +
      "\nLocation : (lat=" +
      userSettings.location.latitude +
      ", lon=" +
      userSettings.location.longitude +
      ")",
    {
      parse_mode: "HTML",
      reply_markup: Markup.inlineKeyboard([
        [
          {
            text: "✏️ Modify",
            callback_data: "modify_setting",
          },
          {
            text: "⛔ Clear",
            callback_data: "clear_setting",
          },
        ],
      ]).reply_markup,
    }
  );
});

commandController.command("weather", async (ctx) => {
  const userId = ctx.message.from.id;
  const userSettings = await userSettingsHelper.get(userId);

  if (!userSettings) {
    ctx.reply(
      `Please resend your location`,
      Markup.keyboard([
        Markup.button.locationRequest("Tap here to send your location 🌍 📌"),
      ]).oneTime(true)
    );
    return;
  }

  await ctx.reply(
    "Select the type of weather forecast, you want : ",
    Markup.inlineKeyboard(WEATHER_MENU)
  );
});

export default commandController;
