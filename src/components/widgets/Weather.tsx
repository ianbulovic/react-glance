"use client";

import Widget from "./Widget";
import useWeather from "@/hooks/useWeather";
import "./weather.css";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../tailwind.config";

function getTemperatureColor(temp: number) {
  const colors: any = resolveConfig(tailwindConfig).theme.colors;

  const stops = [
    [20, colors.purple[300]],
    [50, colors.blue[300]],
    [60, colors.aqua[300]],
    [65, colors.green[300]],
    [70, colors.yellow[300]],
    [80, colors.orange[300]],
    [85, colors.red[200]],
    [100, colors.red[300]],
  ];
  const stopIndex = stops.findIndex(([stop]) => temp < stop);
  if (stopIndex === 0) return stops[0][1];
  if (stopIndex === -1) return stops[stops.length - 1][1];
  const [lowerStop, lowerColor] = stops[stopIndex - 1];
  const [upperStop, upperColor] = stops[stopIndex];
  const percent = (temp - lowerStop) / (upperStop - lowerStop);

  const r1 = parseInt(lowerColor.slice(1, 3), 16);
  const g1 = parseInt(lowerColor.slice(3, 5), 16);
  const b1 = parseInt(lowerColor.slice(5, 7), 16);
  const r2 = parseInt(upperColor.slice(1, 3), 16);
  const g2 = parseInt(upperColor.slice(3, 5), 16);
  const b2 = parseInt(upperColor.slice(5, 7), 16);

  const r3 = Math.round(r1 + (r2 - r1) * percent);
  const g3 = Math.round(g1 + (g2 - g1) * percent);
  const b3 = Math.round(b1 + (b2 - b1) * percent);

  return `#${r3.toString(16).padStart(2, "0")}${g3
    .toString(16)
    .padStart(2, "0")}${b3.toString(16).padStart(2, "0")}`;
}

export default function Weather({ zipCode }: { zipCode: string }) {
  const weatherData = useWeather(zipCode);

  const graphHours = [0, 1, 2, 3, 4, 5, 6];

  const tempBarLow = weatherData
    ? Math.min(...graphHours.map((i) => weatherData.hourly[i].temp))
    : 0;
  const tempBarHigh = weatherData
    ? Math.max(...graphHours.map((i) => weatherData.hourly[i].temp))
    : 0;

  return (
    <Widget title="Weather">
      <div className="flex flex-col w-full items-center gap-2 h-full justify-center">
        <div className="flex flex-row items-center gap-4">
          <div
            className={`wi ${
              weatherData?.current.iconClass || "wi-day-sunny text-yellow-100"
            } text-5xl`}
          />
          <h2 className="text-2xl">
            {weatherData?.current.conditions || "Loading..."}
          </h2>
        </div>
        <span className="text-dark-500 dark:text-light-500 text-opacity-75 dark:text-opacity-75">
          Feels like {weatherData ? Math.round(weatherData.current.temp) : "--"}
          °
        </span>
        <span>
          <span className="high-temp">
            {weatherData ? Math.round(weatherData.daily[0].high) : "--"}°
          </span>
          <span className="low-temp">
            {weatherData ? Math.round(weatherData.daily[0].low) : "--"}°
          </span>
        </span>
        <div className="grid grid-flow-col auto-cols-fr gap-4 h-48 w-full justify-evenly rounded-md items-end">
          {weatherData &&
            graphHours
              .map((i) => weatherData.hourly[i])
              .map((hour) => (
                <div
                  key={`${hour.date.getTime()}-chart`}
                  className="flex flex-col justify-end items-center h-full group w-full"
                >
                  <div className="h-full flex flex-col justify-end items-center origin-bottom group-hover:scale-110 transition-all">
                    <span className="text-sm transition-all group-hover:text-lg">
                      {Math.round(hour.temp)}
                    </span>
                    <div
                      className={`w-4 transition-all rounded-t-full`}
                      style={{
                        height: `${
                          ((hour.temp - tempBarLow) /
                            (tempBarHigh - tempBarLow)) *
                            65 +
                          20
                        }%`,
                        background: `
                          linear-gradient(to bottom, ${getTemperatureColor(
                            hour.temp
                          )}, transparent)`,
                      }}
                    />
                  </div>
                  <div className={`wi ${hour.iconClass} text-2xl`} />
                  <span className="text-sm">
                    {hour.date
                      .toLocaleTimeString("en-US", {
                        hour: "numeric",
                      })
                      .toLowerCase()
                      .replace(" ", "")
                      .slice(0, -1)}
                  </span>
                </div>
              ))}
        </div>
        <span className="text-dark-500 dark:text-light-500 text-opacity-75 dark:text-opacity-75 mt-2">
          {weatherData?.location.name || "---"}
        </span>
      </div>
    </Widget>
  );
}
