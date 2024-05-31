import { useEffect, useState } from "react";
import { fetchWeatherApi } from "openmeteo";
import type { WeatherApiResponse } from "@openmeteo/sdk/weather-api-response";
import type { VariablesWithTime } from "@openmeteo/sdk/variables-with-time";

// conversion from WMO weather interpretation codes
function parseWeatherCode(code: number, isDay: boolean) {
  switch (code) {
    case 0:
      return isDay
        ? { conditions: "Sunny", iconClass: "wi-day-sunny text-yellow-100" }
        : { conditions: "Clear", iconClass: "wi-night-clear text-purple-100" };
    case 1:
      return isDay
        ? {
            conditions: "Mainly Sunny",
            iconClass: "wi-day-sunny text-yellow-100",
          }
        : {
            conditions: "Mainly Clear",
            iconClass: "wi-night-clear text-purple-100",
          };
    case 2:
      return {
        conditions: "Partly Cloudy",
        iconClass: isDay
          ? "wi-day-sunny-overcast text-yellow-100"
          : "wi-night-alt-partly-cloudy text-purple-100",
      };
    case 3:
      return { conditions: "Cloudy", iconClass: "wi-cloudy" };
    case 45:
    case 48:
      return {
        conditions: "Foggy",
        iconClass: isDay
          ? "wi-day-fog text-yellow-100"
          : "wi-night-fog text-purple-100",
      };
    case 51:
      return {
        conditions: "Light Drizzle",
        iconClass: "wi-showers text-aqua-100",
      };
    case 53:
      return { conditions: "Drizzle", iconClass: "wi-showers text-aqua-100" };
    case 55:
      return {
        conditions: "Heavy Drizzle",
        iconClass: "wi-showers text-aqua-100",
      };
    case 56:
      return {
        conditions: "Light Freezing Drizzle",
        iconClass: "wi-sleet text-aqua-100",
      };
    case 57:
      return {
        conditions: "Freezing Drizzle",
        iconClass: "wi-sleet text-aqua-100",
      };
    case 61:
      return { conditions: "Light Rain", iconClass: "wi-rain text-aqua-100" };
    case 63:
      return { conditions: "Rain", iconClass: "wi-rain text-aqua-100" };
    case 65:
      return { conditions: "Heavy Rain", iconClass: "wi-rain text-aqua-100" };
    case 66:
      return {
        conditions: "Light Freezing Rain",
        iconClass: "wi-rain-mix text-aqua-100",
      };
    case 67:
      return {
        conditions: "Freezing Rain",
        iconClass: "wi-rain-mix text-aqua-100",
      };
    case 71:
      return { conditions: "Light Snow", iconClass: "wi-snow" };
    case 73:
      return { conditions: "Snow", iconClass: "wi-snow" };
    case 75:
      return { conditions: "Heavy Snow", iconClass: "wi-snow" };
    case 77:
      return { conditions: "Snow Grains", iconClass: "wi-snow" };
    case 80:
      return {
        conditions: "Light Showers",
        iconClass: "wi-showers text-aqua-100",
      };
    case 81:
      return { conditions: "Showers", iconClass: "wi-showers text-aqua-100" };
    case 82:
      return {
        conditions: "Heavy Showers",
        iconClass: "wi-showers text-aqua-100",
      };
    case 85:
      return { conditions: "Light Snow Showers", iconClass: "wi-snow" };
    case 86:
      return { conditions: "Snow Showers", iconClass: "wi-snow" };
    case 95:
      return {
        conditions: "Thunderstorm",
        iconClass: "wi-thunderstorm text-purple-100",
      };
    case 96:
      return {
        conditions: "Light Thunderstorms With Hail",
        iconClass: "wi-storm-showers text-purple-100",
      };
    case 99:
      return {
        conditions: "Thunderstorm With Hail",
        iconClass: "wi-thunderstorm text-purple-100",
      };
    default:
      return { conditions: "", iconClass: "" };
  }
}

type WeatherData = {
  location: {
    name: string;
    utcOffsetSeconds: number;
    timezone: string;
    timezoneAbbreviation: string;
    latitude: number;
    longitude: number;
  };
  current: {
    date: Date;
    isDay: boolean;
    temp: number;
    feelsLike: number;
    conditions: string;
    iconClass: string;
  };
  hourly: {
    date: Date;
    temp: number;
    feelsLike: number;
    conditions: string;
    iconClass: string;
    precip: {
      probability: number;
      amount: number;
    };
  }[];
  daily: {
    date: Date;
    high: number;
    low: number;
    conditions: string;
    iconClass: string;
    precip: {
      probability: number;
      amount: number;
    };
  }[];
};

const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

async function fetchWeather(zipCode: string): Promise<WeatherData> {
  const geoData = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${zipCode}&count=1&language=en&format=json`
  ).then((res) => res.json());

  const weatherParams = {
    latitude: geoData.results[0].latitude,
    longitude: geoData.results[0].longitude,
    current: [
      "is_day",
      "temperature_2m",
      "apparent_temperature",
      "weather_code",
    ],
    hourly: [
      "temperature_2m",
      "apparent_temperature",
      "precipitation_probability",
      "precipitation",
      "weather_code",
      "is_day",
    ],
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_sum",
      "precipitation_probability_max",
    ],
    forecast_hours: 12,
    timezone: "auto",
    temperature_unit: "fahrenheit",
  };

  const weatherResponse = (
    await fetchWeatherApi(
      "https://api.open-meteo.com/v1/forecast",
      weatherParams
    )
  )[0];

  const parseLocation = (geoData: any, weatherResponse: WeatherApiResponse) => {
    const name: string = geoData.results[0].name;
    const utcOffsetSeconds = weatherResponse.utcOffsetSeconds();
    const timezone = weatherResponse.timezone()!;
    const timezoneAbbreviation = weatherResponse.timezoneAbbreviation()!;
    const latitude = weatherResponse.latitude();
    const longitude = weatherResponse.longitude();
    return {
      name,
      utcOffsetSeconds,
      timezone,
      timezoneAbbreviation,
      latitude,
      longitude,
    };
  };

  const parseCurrent = (current: VariablesWithTime) => {
    const date = new Date(Number(current.time()) * 1000);
    const isDay = current.variables(0)!.value() === 1;
    const temp = current.variables(1)!.value();
    const feelsLike = current.variables(2)!.value();
    const weatherCode = current.variables(3)!.value();
    const { conditions, iconClass } = parseWeatherCode(weatherCode, isDay);
    return { date, isDay, temp, feelsLike, conditions, iconClass };
  };

  const parseHourly = (hourly: VariablesWithTime) => {
    const times = range(
      Number(hourly.time()),
      Number(hourly.timeEnd()),
      hourly.interval()
    ).map((t) => new Date(t * 1000));
    return times.map((time, i) => {
      const temp = hourly.variables(0)!.valuesArray()![i];
      const feelsLike = hourly.variables(1)!.valuesArray()![i];
      const precipProbability = hourly.variables(2)!.valuesArray()![i];
      const precipAmount = hourly.variables(3)!.valuesArray()![i];
      const weatherCode = hourly.variables(4)!.valuesArray()![i];
      const isDay = hourly.variables(5)!.valuesArray()![i] === 1;
      const { conditions, iconClass } = parseWeatherCode(weatherCode, isDay);
      return {
        date: time,
        temp,
        feelsLike,
        conditions,
        iconClass,
        precip: { probability: precipProbability, amount: precipAmount },
      };
    });
  };

  const parseDaily = (daily: VariablesWithTime) => {
    const times = range(
      Number(daily.time()),
      Number(daily.timeEnd()),
      daily.interval()
    ).map((t) => new Date(t * 1000));
    return times.map((time, i) => {
      const weatherCode = daily.variables(0)!.valuesArray()![i];
      const { conditions, iconClass } = parseWeatherCode(weatherCode, true);
      const high = daily.variables(1)!.valuesArray()![i];
      const low = daily.variables(2)!.valuesArray()![i];
      const precipAmount = daily.variables(3)!.valuesArray()![i];
      const precipProbability = daily.variables(4)!.valuesArray()![i];
      return {
        date: time,
        high,
        low,
        conditions,
        iconClass,
        precip: { probability: precipProbability, amount: precipAmount },
      };
    });
  };

  const location = parseLocation(geoData, weatherResponse);
  const current = parseCurrent(weatherResponse.current()!);
  const hourly = parseHourly(weatherResponse.hourly()!);
  const daily = parseDaily(weatherResponse.daily()!);

  return { location, current, hourly, daily };
}

export default function useWeather(zipCode: string) {
  const [data, setData] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetchWeather(zipCode).then((data) => {
      setData(data);
    });
  }, [zipCode]);

  return data;
}
