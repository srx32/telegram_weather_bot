import "dotenv/config";

import { Markup, Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { USER_SETTINGS } from "./models/user-settings.model";
import { DateTime } from "luxon";
import currentWeatherController from "./controllers/current-weather.controller";
import hourlyWeatherController from "./controllers/hourly-weather.controller";
import dailyWeatherController from "./controllers/daily-weather.controller";
import { WEATHER_MENU } from "./models/weather-menu.model";
import commandController from "./controllers/command.controller";
import locationController from "./controllers/location.controller";

const bot = new Telegraf(process.env.BOT_TOKEN!);

// Set the bot API endpoint
// app.use(
//   async () =>
//     await bot.createWebhook({ domain: String(process.env.SERVER_URL) })
// );

bot.action("weather_menu", async (ctx) => {
  await ctx.editMessageReplyMarkup({
    inline_keyboard: WEATHER_MENU,
  });
});

// Order is important. Commands controller/middleware should come before messages (text) controller/middleware
bot.use(commandController);
bot.use(locationController);
bot.use(currentWeatherController);
bot.use(hourlyWeatherController);
bot.use(dailyWeatherController);

// bot.hears(/reverse (.+)/, (ctx) =>
//   ctx.reply(ctx.match[1].split('').reverse().join(''))
// )

// bot.hears("There", async (ctx) => {
//   await ctx.reply("Ok ?");
// });

// bot.on(message("text"), async (ctx) => {
//   console.log("Message received");

//   // Explicit usage
//   await ctx.telegram.sendMessage(
//     ctx.message.chat.id,
//     `Hello ${ctx.state.role}`
//   );
// });

export default bot;
