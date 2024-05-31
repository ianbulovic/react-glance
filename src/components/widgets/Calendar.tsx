"use client";

import Widget from "./Widget";

function generateGrid() {
  const grid = [];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month, daysInMonth).getDay();

  // add days from the previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    grid.push({
      day: new Date(year, month, 0 - i).getDate(),
      current: false,
    });
  }

  // add days from the current month
  for (let i = 1; i <= daysInMonth; i++) {
    grid.push({ day: i, current: true });
  }

  // add days from the next month
  for (let i = 1; i <= 6 - lastDay; i++) {
    grid.push({ day: i, current: false });
  }

  // split the grid into weeks
  const weeks = [];
  for (let i = 0; i < grid.length; i += 7) {
    weeks.push(grid.slice(i, i + 7));
  }

  return weeks;
}

export default function Calendar() {
  return (
    <Widget title="Calendar">
      <h3 className="text-xl font-bold mb-3 text-blue-200">
        {new Date().toLocaleString("default", { month: "long" })}{" "}
        {new Date().getFullYear()}
      </h3>
      <table className="w-full text-sm">
        <thead /*className="border-b border-light-500 dark:border-dark-500"*/>
          <tr className="text-blue-100">
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>
          {generateGrid().map((week, i) => (
            <tr key={i}>
              {week.map((day, j) => (
                <td
                  key={j}
                  className={`${
                    day.current && day.day === new Date().getDate()
                      ? "bg-light-500 dark:bg-dark-500 rounded-lg text-red-100 font-bold"
                      : day.current
                      ? "text-inherit"
                      : "text-light-700 dark:text-dark-700"
                  } text-center p-2`}
                >
                  {day.day}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Widget>
  );
}
