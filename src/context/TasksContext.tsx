import { createContext } from "react";
import type { TaskAction, Task } from "../types/contracts";

export type TasksState = Record<string, Task[]>;

export type TasksContextType = {
  tasks: TasksState;
  dispatchTasks: React.Dispatch<TaskAction>;
};


export const TasksContext = createContext<TasksContextType | undefined>(undefined);
