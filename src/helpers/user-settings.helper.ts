import { UserSettingsHelper, UserSettings } from "../models/user-settings.model";

async function get(userId: number) {
  try {
    const userSettings = await UserSettingsHelper.findOne(
      { userId: userId },
      { __v: 0 }
    );
    // console.log("User settings : " + userSettings);

    return userSettings;
  } catch (error) {
    console.error("Error while trying to find user settings : " + error);

    throw error;
  }
}

async function save(userData: UserSettings) {
  try {
    await UserSettingsHelper.create(userData);
  } catch (error) {
    console.log("Error while saving user settings : " + error);

    throw error;
  }
}

async function clear(userId: number) {
  try {
    const cleared = await UserSettingsHelper.deleteOne({ userId: userId });

    return cleared.deletedCount === 1;
  } catch (error) {
    console.log("Error while deleting user settings : " + error);

    throw error;
  }
}

export { get, save, clear };
