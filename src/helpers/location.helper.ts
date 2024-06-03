import { Context, Markup } from "telegraf";

const LOCATION_MENU = [
  [
    {
      text: "🏙️ City",
      callback_data: "city",
    },
  ],
  [
    {
      text: "📌 Location",
      callback_data: "location",
    },
  ],
];

async function replyWithLocationMenu(
  ctx: Context,
  message?: string 
) {
  message =
    message === undefined
      ? "To proceed, we need your location.\nYou can send your location or send the city name :"
      : message;

  await ctx.reply(message, Markup.inlineKeyboard(LOCATION_MENU));
}

export { replyWithLocationMenu };
