import { useEffect, useReducer, useState, type ReactNode } from "react";
import { TrashContext } from "./TrashContext";
import useTrashReducer, { initialTrashState } from "../hooks/useTrashReducer";
import { loadJSON, saveJSON, STORAGE_KEYS } from "../utils/storage";
import type { TrashState } from "../types/trash";

export const TrashProvider = ({ children }: { children: ReactNode }) => {
  const [trash, dispatchTrash] = useReducer(useTrashReducer, undefined, () =>
    loadJSON<TrashState>(STORAGE_KEYS.trash, initialTrashState),
  );
  const [isTrashOpen, setTrashOpen] = useState(false);

  useEffect(() => {
    saveJSON(STORAGE_KEYS.trash, trash);
  }, [trash]);

  return (
    <TrashContext.Provider value={{ trash, dispatchTrash, isTrashOpen, setTrashOpen }}>
      {children}
    </TrashContext.Provider>
  );
};

export default TrashProvider;
