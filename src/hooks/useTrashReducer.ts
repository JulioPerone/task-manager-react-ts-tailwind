// Reducer de papelera: archiva snapshots de grupos y tareas para poder restaurarlos.

import type { TrashAction, TrashState } from "../types/trash";

export const initialTrashState: TrashState = { groups: [], tasks: [] };

const useTrashReducer = (state: TrashState, action: TrashAction): TrashState => {
  switch (action.type) {
    case "TRASH_GROUP": {
      // Evita duplicados si se re-archiva el mismo grupo
      if (state.groups.some((g) => g.group.id === action.payload.group.id)) return state;
      // Las tareas sueltas de ese grupo quedan absorbidas por el snapshot del grupo
      const remainingTasks = state.tasks.filter((t) => t.groupId !== action.payload.group.id);
      return {
        groups: [
          ...state.groups,
          { group: action.payload.group, tasks: action.payload.tasks, deletedAt: Date.now() },
        ],
        tasks: remainingTasks,
      };
    }

    case "TRASH_TASK":
      if (
        state.tasks.some(
          (t) => t.groupId === action.payload.groupId && t.task.id === action.payload.task.id,
        )
      )
        return state;
      return {
        ...state,
        tasks: [
          ...state.tasks,
          {
            task: action.payload.task,
            groupId: action.payload.groupId,
            groupName: action.payload.groupName,
            deletedAt: Date.now(),
          },
        ],
      };

    case "RESTORE_GROUP":
      return { ...state, groups: state.groups.filter((g) => g.group.id !== action.payload.id) };

    case "RESTORE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter(
          (t) => !(t.groupId === action.payload.groupId && t.task.id === action.payload.taskId),
        ),
      };

    case "RESTORE_ALL_GROUPS":
      return { ...state, groups: [] };

    case "RESTORE_ALL_TASKS":
      return { ...state, tasks: [] };

    case "RESTORE_ALL":
    case "EMPTY_TRASH":
      return { groups: [], tasks: [] };

    case "PURGE_GROUP":
      return { ...state, groups: state.groups.filter((g) => g.group.id !== action.payload.id) };

    case "PURGE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter(
          (t) => !(t.groupId === action.payload.groupId && t.task.id === action.payload.taskId),
        ),
      };

    case "HYDRATE_TRASH":
    case "SET_TRASH":
      return action.payload.trash;

    default:
      return state;
  }
};

export default useTrashReducer;
