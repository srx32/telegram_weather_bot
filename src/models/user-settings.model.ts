export interface UserSettings {
  chatId: number;
  userId: number;
  location: UserLocation;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export const USER_SETTINGS: UserSettings[] = [];
