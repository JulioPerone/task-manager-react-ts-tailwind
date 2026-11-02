// Providers aislados para el tutorial: mismo shape de contexto que la app,
// pero 100% en memoria (sin localStorage). Lo que se practique aquí no se guarda.
import { useReducer, useState, type ReactNode } from "react";
import { TasksContext } from "../../context/TasksContext";
import { TrashContext } from "../../context/TrashContext";
import useTasksReducer from "../../hooks/useTasksReducer";
import useTrashReducer, { initialTrashState } from "../../hooks/useTrashReducer";

const TutorialSandboxProviders = ({ children }: { children: ReactNode }) => {
  const [tasks, dispatchTasks] = useReducer(useTasksReducer, {});
  const [trash, dispatchTrash] = useReducer(useTrashReducer, initialTrashState);
  const [isTrashOpen, setTrashOpen] = useState(false);

  return (
    <TasksContext.Provider value={{ tasks, dispatchTasks }}>
      <TrashContext.Provider value={{ trash, dispatchTrash, isTrashOpen, setTrashOpen }}>
        {children}
      </TrashContext.Provider>
    </TasksContext.Provider>
  );
};

export default TutorialSandboxProviders;
