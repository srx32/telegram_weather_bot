import "dotenv/config";

import { Markup, Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import {
  getCurrentWeather,
  getDailyWeather,
  getHourlyWeather,
  getMatchingEmoji,
} from "./controllers/weather.controller";
import { USER_SETTINGS } from "./models/user-settings.model";
import { DateTime } from "luxon";

const bot = new Telegraf(process.env.BOT_TOKEN!);

const weatherMenu = [
  [
    {
      text: "⬇️ Current weather",
      callback_data: "current",
    },
  ],
  [
    {
      text: "🕛 Hourly weather (6 - 48h)",
      callback_data: "hourly",
    },
  ],
  [
    {
      text: "🗓️ Daily weather (1 - 8d)",
      callback_data: "daily",
    },
  ],
];

const hourlyMenu = [
  [
    {
      text: "6-hour",
      callback_data: "hourly-6",
    },

    {
      text: "12-hour",
      callback_data: "hourly-12",
    },
  ],
  [
    {
      text: "24-hour",
      callback_data: "hourly-24",
    },

    {
      text: "48-hour",
      callback_data: "hourly-48",
    },
  ],
  [
    {
      text: "🔙 Go back",
      callback_data: "weather_menu",
    },
  ],
];

const dailyMenu = [
  [
    {
      text: "1-day",
      callback_data: "daily-1",
    },

    {
      text: "2-day",
      callback_data: "daily-2",
    },
  ],
  [
    {
      text: "5-day",
      callback_data: "daily-5",
    },

    {
      text: "8-day",
      callback_data: "daily-8",
    },
  ],
  [
    {
      text: "🔙 Go back",
      callback_data: "weather_menu",
    },
  ],
];

// Set the bot API endpoint
// app.use(
//   async () =>
//     await bot.createWebhook({ domain: String(process.env.SERVER_URL) })
// );

bot.start(async (ctx) => {
  await ctx.telegram.sendMessage(
    ctx.message.chat.id,
    `Hello ${ctx.message.from.first_name}
    
Thanks for using my 🐉 weather bot

Press or enter /help to get the list of commands.
`
  );
});

bot.help(async (ctx) => {
  await ctx.telegram.sendMessage(
    ctx.message.chat.id,
    `To get you started :

1 - First, we'll need your location (GPS or city-country you live in).

2 - Second, you'll select the type of weather forecast you want.

3 - And finally, we'll display the data to you.

Sounds good ? Then, let's go!

Smash or enter /setup to start.
  `
    // {
    //   reply_markup: {
    //     inline_keyboard: [
    //       [
    //         {
    //           text: "Here",
    //           callback_data: "here",
    //         },
    //         {
    //           text: "There",
    //           callback_data: "There",
    //         },
    //       ],
    //     ],

    //   },
    // }
  );
});

bot.command("setup", async (ctx) => {
  await ctx.reply(
    "First, your location",

    Markup.keyboard([
      Markup.button.locationRequest("Tap here to send your location 🌍 📌"),
    ]).oneTime(true)
  );

  // TODO: Remove inline keyboard after user click
});

bot.on(message("location"), async (ctx) => {
  const location = ctx.message.location;

  console.log(location);

  USER_SETTINGS.push({
    chatId: ctx.chat.id,
    userId: ctx.message.from.id,
    location: { latitude: location.latitude, longitude: location.longitude },
  });

  await ctx.reply(`Coordinates received!`, Markup.removeKeyboard());

  await ctx.reply(
    `Now, select the type of weather forecast you want : `,
    Markup.inlineKeyboard(weatherMenu)
  );

  //   await ctx.reply(
  //     `Here are your coordinates :
  // lat: ${location.latitude} + lon: ${location.longitude}
  // `
  //   );

  //   await ctx.replyWithLocation(location.latitude, location.longitude);

  // const weather = await getCurrentWeather(
  //   location.latitude,
  //   location.longitude
  // );

  // await ctx.reply(
  //   `Here is your current weather: ${weather?.current?.weather[0].description}`,
  //   Markup.removeKeyboard()
  // );
});

bot.action("current", async (ctx) => {
  // const chatId = ctx.chat.id

  const userSettings = USER_SETTINGS.find(
    (userSettings) => userSettings.userId === ctx.callbackQuery.from.id
  );

  if (!userSettings) {
    ctx.reply(`Please resend your location`);
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

  await ctx.reply(`Here is your current weather: \n${weatherText}`, {
    parse_mode: "HTML",
  });
});

bot.action("hourly", async (ctx) => {
  // const chatId = ctx.chat.id

  await ctx.answerCbQuery();

  await ctx.editMessageReplyMarkup({
    inline_keyboard: hourlyMenu,
  });
});

bot.action(/hourly-(.+)/, async (ctx) => {
  // const chatId = ctx.chat.id

  const nbHours = Number(ctx.match[1]);

  console.log("Number of hours : " + nbHours);

  const userSettings = USER_SETTINGS.find(
    (userSettings) => userSettings.userId === ctx.callbackQuery.from.id
  );

  if (!userSettings) {
    ctx.reply(`Please resend your location`);
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

  await ctx.reply(`Here is your hourly weather: \n${weatherText}`, {
    parse_mode: "HTML",
  });
});

bot.action("weather_menu", async (ctx) => {
  await ctx.editMessageReplyMarkup({
    inline_keyboard: weatherMenu,
  });
});

bot.action("daily", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.editMessageReplyMarkup({
    inline_keyboard: dailyMenu,
  });
});

bot.action(/daily-(.+)/, async (ctx) => {
  const nbDays = Number(ctx.match[1]);

  console.log("Number of days : " + nbDays);

  const userSettings = USER_SETTINGS.find(
    (userSettings) => userSettings.userId === ctx.callbackQuery.from.id
  );

  if (!userSettings) {
    ctx.reply(`Please resend your location`);
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
        `\n${weatherEmoji} ${hf.temp.day} ~ ${hf.temp.eve} °C` +
        `\n<b>${hf.weather[0].description.toUpperCase()}</b>` +
        `\n\n`;
    }
  });

  await ctx.answerCbQuery();

  await ctx.reply(`Here is your daily weather: ${weatherText}`, {
    parse_mode: "HTML",
  });
});

// bot.hears(/reverse (.+)/, (ctx) =>
//   ctx.reply(ctx.match[1].split('').reverse().join(''))
// )

// bot.hears("There", async (ctx) => {
//   await ctx.reply("Ok ?");
// });

// bot.action("here", async (ctx) => {
//   await ctx.answerCbQuery(); // Display a toast notif if given a string value
//   await ctx.reply("Fuck off ?");
// });

bot.on(message("text"), async (ctx) => {
  console.log("Message received");

  // Explicit usage
  await ctx.telegram.sendMessage(
    ctx.message.chat.id,
    `Hello ${ctx.state.role}`
  );

  // Using context shortcut
  // await ctx.reply(`Hello ${ctx.state.role}`);
});

bot.inlineQuery("here", async (ctx) => {
  await ctx.reply("Fuck off ?");
});

bot.command("ok", async (ctx) => {
  await ctx.reply("Fuck off ?");
});

export default bot;
