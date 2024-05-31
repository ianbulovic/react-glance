"use client";

import { useRef, useState, useEffect } from "react";

import useKeyDown from "@/hooks/useKeyShortcut";

import Widget from "./Widget";

export default function Search() {
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState(
    "Press / to search DuckDuckGo" as string
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useKeyDown("/", { onKeyDown: () => inputRef.current?.focus() });

  useKeyDown("Escape", {
    onKeyDown: () => {
      setQuery("");
      inputRef.current?.blur();
    },
    requireFocus: inputRef.current,
  });

  useKeyDown("Enter", {
    onKeyDown: () => {
      if (query !== "" && document.activeElement === inputRef.current) {
        window.location.href = `https://duckduckgo.com/?q=${query}`;
      }
    },
    requireFocus: inputRef.current,
  });

  return (
    <Widget title="Search">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        onFocus={() => setPlaceholder("")}
        onBlur={() => setPlaceholder("Press / to search DuckDuckGo")}
        className="py-2 px-3 rounded-lg w-full bg-light-100 dark:bg-dark-500 placeholder-dark-500 dark:placeholder-light-500 outline-none outline-1 outline-offset-0 focus:outline-dark-300 dark:focus:outline-light-300 transition-all duration-150 ease-out"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </Widget>
  );
}
