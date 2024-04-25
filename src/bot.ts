import "dotenv/config";

import { Markup, Telegraf } from "telegraf";
import { message } from "telegraf/filters";

const bot = new Telegraf(process.env.BOT_TOKEN!);

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
      Markup.button.locationRequest("Tap here to send your location 🌍", true),
    ], )
  );

  // TODO: Remove inline keyboard after user click
});

bot.on(message("location"), async (ctx) => {
  const location = ctx.message.location;

  console.log(location);

  await ctx.reply(`Here are your coordinates : 
lat: ${location.latitude} + lon: ${location.longitude} 
\n.
`);

  await ctx.replyWithLocation(location.latitude, location.longitude);
});

// bot.hears("There", async (ctx) => {
//   await ctx.reply("Ok ?");
// });

bot.action("here", async (ctx) => {
  await ctx.answerCbQuery(); // Display a toast notif if given a string value
  await ctx.reply("Fuck off ?");
});

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
