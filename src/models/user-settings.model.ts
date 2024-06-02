import mongoose from "mongoose";

interface UserSettings {
  chatId: number;
  userId: number;
  location: UserLocation;
  city: string;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

const userLocationSchema = new mongoose.Schema<UserLocation>(
  {
    latitude: { type: Number, required: true },
    longitude: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const userSettingsSchema = new mongoose.Schema<UserSettings>({
  chatId: {
    type: Number,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
  },
  location: { type: userLocationSchema, required: true },
  city: {
    type: String,
    required: true,
  },
});

const UserSettingsHelper = mongoose.model("UserSettings", userSettingsSchema);

export { UserSettingsHelper, UserSettings };
