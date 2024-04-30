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

const WEATHER_MENU = [
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

const HOURLY_MENU = [
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

const DAILY_MENU = [
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

export { LOCATION_MENU, WEATHER_MENU, HOURLY_MENU, DAILY_MENU };
