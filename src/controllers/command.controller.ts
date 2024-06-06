import { Composer, Markup } from "telegraf";

import { WEATHER_MENU } from "../models/weather-menu.model";
import * as userSettingsHelper from "../helpers/user-settings.helper";
import { replyWithLocationMenu } from "../helpers/location.helper";

const commandController = new Composer();

commandController.start(async (ctx) => {
  await ctx.telegram.setMyCommands([
    { command: "start", description: "start the bot" },
    { command: "help", description: "display manual and all bot commands" },
    { command: "setup", description: "set up location for weather forecast" },
    { command: "settings", description: "display bot's settings for you" },
    { command: "weather", description: "get a weather forecast" },
  ]);

  await ctx.telegram.sendMessage(
    ctx.message.chat.id,
    `
    Hello ${ctx.message.from.first_name}
    \nThanks for using my 🐉 weather bot
    \nPress or enter /help to get the list of commands.
    `
  );
});

commandController.help(async (ctx) => {
  const commands = await ctx.telegram.getMyCommands();

  const commandsText = commands
    .map((value) => {
      return "/" + value.command + " - " + value.description;
    })
    .join("\n");

  await ctx.telegram.sendMessage(
    ctx.message.chat.id,
    `
    <b>To get you started :</b>
    \n1 - First, we'll need your location (GPS or city-country you live in).
    \n2 - Second, you'll select the type of weather forecast you want.
    \n3 - And finally, we'll display the data to you.
    \nSounds good ? Then, let's go! Type or tap /setup to start.
    \n<b>Also, here is a list of all commands :</b>
    \n${commandsText}
    `,
    { parse_mode: "HTML" }
  );
});

commandController.command("setup", async (ctx) => {
  await replyWithLocationMenu(ctx);
});

commandController.command("settings", async (ctx) => {
  const userId = ctx.message.from.id;
  const userSettings = await userSettingsHelper.get(userId);

  if (!userSettings) {
    ctx.reply(
      `You haven't set your settings. Do you want to set them, now ?`,
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
            text: "✏️ Edit",
            callback_data: "edit_settings",
          },
          {
            text: "⛔ Clear",
            callback_data: "clear_settings",
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
    await replyWithLocationMenu(ctx);

    return;
  }

  await ctx.reply(
    "Select the type of weather forecast, you want : ",
    Markup.inlineKeyboard(WEATHER_MENU)
  );
});

export default commandController;
