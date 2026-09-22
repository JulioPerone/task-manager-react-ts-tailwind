import { useEffect, useReducer, type ReactNode } from "react";
import { TasksContext } from "./TasksContext";
import useTasksReducer from "../hooks/useTasksReducer";
import { loadJSON, saveJSON, STORAGE_KEYS } from "../utils/storage";
import type { Task } from "../types/contracts";

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  // Estado indexado por groupId con carga diferida y persistencia en localStorage
  const [tasks, dispatchTasks] = useReducer(
    useTasksReducer,
    undefined,
    () => loadJSON<Record<string, Task[]>>(STORAGE_KEYS.tasks, {}),
  );

  useEffect(() => {
    saveJSON(STORAGE_KEYS.tasks, tasks);
  }, [tasks]);

  return (
    <TasksContext.Provider value={{ tasks, dispatchTasks }}>
      {children}
    </TasksContext.Provider>
  );
};
