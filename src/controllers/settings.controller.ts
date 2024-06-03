import { Composer, Markup } from "telegraf";

import * as userSettingsHelper from "../helpers/user-settings.helper";
import { replyWithLocationMenu } from "../helpers/location.helper";

const settingsController = new Composer();

settingsController.action("edit_settings", async (ctx) => {
  try {
    await ctx.answerCbQuery();

    await ctx.deleteMessage();

    await await replyWithLocationMenu(ctx);
  } catch (error) {
    console.error(error);
  }
});

settingsController.action("clear_settings", async (ctx) => {
  //   await ctx.editMessageReplyMarkup(
  //     Markup.inlineKeyboard(HOURLY_MENU).reply_markup
  //   );

  try {
    const userId = ctx.callbackQuery.from.id;
    const deleted = await userSettingsHelper.clear(userId);

    if (!deleted) {
      await ctx.answerCbQuery("Error : Couldn't clear settings");

      return;
    }

    await ctx.answerCbQuery("Settings cleared!");

    await ctx.deleteMessage();

    await ctx.reply(
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
  } catch (error) {
    console.error(error);
  }
});

export default settingsController;
