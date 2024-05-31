"use client";

import React, { useRef, useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import useKeyDown from "@/hooks/useKeyShortcut";
import Widget from "./Widget";

import { FiTrash2 } from "react-icons/fi";
import useCookie from "@/hooks/useCookie";
import NoSsr from "../NoSsr";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

type DragAndDrop = {
  draggedFrom: number | null;
  draggedTo: number | null;
  isDragging: boolean;
  originalOrder: Task[];
  updatedOrder: Task[];
  draggedElement: HTMLElement | null;
};

export default function Tasks() {
  const [tasks, setTasks] = useCookie<Task[]>("tasks", [], 1000);
  const [taskName, setTaskName] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);
  const [placeholder, setPlaceholder] = useState("Press T to add a task");
  const [dragAndDrop, setDragAndDrop] = useState<DragAndDrop>({
    draggedFrom: null,
    draggedTo: null,
    isDragging: false,
    originalOrder: [],
    updatedOrder: [],
    draggedElement: null,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const addTask = () => {
    if (taskName.trim() === "") return;
    setTasks([...tasks, { id: Date.now(), text: taskName, completed: false }]);
    setTaskName("");
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  useKeyDown("t", {
    onKeyDown: () => {
      inputRef.current?.focus();
    },
  });

  useKeyDown("Escape", {
    onKeyDown: () => {
      setTaskName("");
      inputRef.current?.blur();
    },
    requireFocus: inputRef.current,
  });

  useKeyDown("Enter", {
    onKeyDown: () => {
      if (taskName !== "") {
        addTask();
      }
    },
    requireFocus: inputRef.current,
  });

  const onDragStart = (event: React.DragEvent<HTMLLIElement>) => {
    const target = event.currentTarget as HTMLElement;

    window.requestAnimationFrame(() => {
      target.style.display = "none";
    });

    const initialPosition = Number(target.dataset.position);

    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: initialPosition,
      isDragging: true,
      originalOrder: tasks,
      draggedElement: target,
    });

    event.dataTransfer?.setData("text/html", "");
  };

  const onDragOver = (event: React.DragEvent<HTMLLIElement>) => {
    event.preventDefault();
    let newList = dragAndDrop.originalOrder;

    const draggedFrom = dragAndDrop.draggedFrom!;

    const draggedTo = Number(
      (event.currentTarget as HTMLElement).dataset.position
    );

    const itemDragged = newList[draggedFrom];

    const remainingItems = newList.filter((_, index) => index !== draggedFrom);

    newList = [
      ...remainingItems.slice(0, draggedTo),
      itemDragged,
      ...remainingItems.slice(draggedTo),
    ];

    if (draggedTo !== dragAndDrop.draggedTo) {
      setDragAndDrop({
        ...dragAndDrop,
        updatedOrder: newList,
        draggedTo: draggedTo,
      });
    }
  };

  const onDrop = (event: React.DragEvent<HTMLLIElement>) => {
    window.requestAnimationFrame(() => {
      dragAndDrop.draggedElement!.style.display = "";
    });

    setTasks(dragAndDrop.updatedOrder);

    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: null,
      draggedTo: null,
      isDragging: false,
      draggedElement: null,
    });
  };

  const onDragEnd = () => {
    const element = dragAndDrop.draggedElement;
    if (!element) return;

    window.requestAnimationFrame(() => {
      element.style.display = "";
    });

    setTasks(dragAndDrop.updatedOrder);

    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: null,
      draggedTo: null,
      isDragging: false,
      draggedElement: null,
    });
  };

  return (
    <Widget title="Tasks">
      <NoSsr>
        <section className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onFocus={() => setPlaceholder("")}
            onBlur={() => setPlaceholder("Press T to add a task")}
            placeholder={placeholder}
            className="py-2 px-3 rounded-lg w-full bg-light-100 dark:bg-dark-500 placeholder-dark-500 dark:placeholder-light-500 outline-none outline-1 outline-offset-0 focus:outline-dark-300 dark:focus:outline-light-300 transition-all duration-150 ease-out"
          />

          <button
            className="text-sm text-dark-700 dark:text-light-700 hover:text-dark-500 dark:hover:text-light-500 transition-all duration-150 ease-out"
            onClick={() => setShowCompleted(!showCompleted)}
          >
            {showCompleted ? "Hide" : "Show"} completed tasks
            {!showCompleted &&
              ` (${tasks.filter((task) => task.completed).length})`}
          </button>
          <ul className="flex flex-col gap-0">
            {tasks.map((task, index) => (
              <li
                key={task.id}
                className={`flex items-center gap-2 group my-0 ${
                  !showCompleted && task.completed ? "hidden" : ""
                }  border-dark-300 dark:border-light-300 transition-all duration-100 ease-linear`}
                style={{
                  paddingTop:
                    dragAndDrop.isDragging &&
                    dragAndDrop.draggedTo === Number(index) &&
                    dragAndDrop.draggedFrom! > Number(index)
                      ? "1rem"
                      : "0.2rem",
                  paddingBottom:
                    dragAndDrop.isDragging &&
                    dragAndDrop.draggedTo === Number(index) &&
                    dragAndDrop.draggedFrom! < Number(index)
                      ? "1rem"
                      : "0.2rem",
                }}
                data-position={index}
                draggable="true"
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="appearance-none h-4 w-4 border border-dark-300 dark:border-light-300 rounded checked:bg-dark-500 dark:checked:bg-light-500 checked:border-transparent transition-all duration-100 ease-linear"
                />
                <p
                  className={
                    task.completed
                      ? "line-through text-dark-500 dark:text-light-500 "
                      : ""
                  }
                  onClick={() => toggleTask(task.id)}
                >
                  {task.text}
                </p>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 text-opacity-0 group-hover:text-opacity-100 transition-all duration-100 ease-out hover:text-lg origin-center flex align-center justify-center w-5"
                >
                  <FiTrash2 />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </NoSsr>
    </Widget>
  );
}
