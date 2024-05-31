import { Fragment } from "react";
import Widget from "./Widget";

const colorMap: Record<string, string> = {
  red: "text-red-200",
  green: "text-green-200",
  yellow: "text-yellow-200",
  blue: "text-blue-200",
  purple: "text-purple-200",
  aqua: "text-aqua-200",
  orange: "text-orange-200",
};

const hoverMap: Record<string, string> = {
  red: "hover:text-red-200",
  green: "hover:text-green-200",
  yellow: "hover:text-yellow-200",
  blue: "hover:text-blue-200",
  purple: "hover:text-purple-200",
  aqua: "hover:text-aqua-200",
  orange: "hover:text-orange-200",
};

function LinkGroup({
  title,
  color,
  links,
}: {
  title: string;
  color: "red" | "green" | "yellow" | "blue" | "purple" | "aqua" | "orange";
  links: { title: string; url: string }[];
}) {
  const twColor = colorMap[color];
  const twHover = hoverMap[color];
  return (
    <>
      <h3 className={`${twColor} font-bold text-xl`}>{title}</h3>
      <ul>
        {links.map((link, i) => (
          <li key={link.url} className={`${twHover} w-fit`}>
            <a href={link.url} className="hover:underline underline-offset-4">
              {link.title + " "}
              <span className={`text-sm font-sans ${twColor}`}>↗︎</span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function Bookmarks({
  groups,
}: {
  groups: {
    title: string;
    color: "red" | "green" | "yellow" | "blue" | "purple" | "aqua" | "orange";
    links: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <Widget title="Bookmarks">
      <div className="flex flex-col gap-2">
        {groups.map((group, i) => (
          <Fragment key={group.title}>
            <LinkGroup {...group} />
            {i < groups.length - 1 && (
              <hr className="border-light-300 dark:border-dark-400 my-3" />
            )}
          </Fragment>
        ))}
      </div>
    </Widget>
  );
}
