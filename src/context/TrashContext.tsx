// Contexto de papelera + estado de apertura del submenú deslizante.

import { createContext } from "react";
import type { TrashAction, TrashState } from "../types/trash";

export type TrashContextType = {
  trash: TrashState;
  dispatchTrash: React.Dispatch<TrashAction>;
  isTrashOpen: boolean;
  setTrashOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TrashContext = createContext<TrashContextType | undefined>(undefined);
