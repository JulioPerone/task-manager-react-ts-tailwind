import type { Task, TaskAction } from "../types/contracts";

type TasksState = Record<string, Task[]>;

// Reducer de tareas agrupadas por groupId (DELETE_GROUP_TASKS lo usa el borrado en cascada)
const useTasksReducer = (state: TasksState, action: TaskAction): TasksState => {
    switch (action.type) {
        case "ADD_TASK":
            return {
                ...state,
                [action.payload.groupId]: [
                    ...(state[action.payload.groupId] || []),
                    { id: crypto.randomUUID(), title: action.payload.title, completed: false }
                ]
            };

        case "EDIT_TASK":
            return {
                ...state,
                [action.payload.groupId]: state[action.payload.groupId].map(t =>
                    t.id === action.payload.taskId ? { ...t, title: action.payload.title } : t
                )
            };

        case "DELETE_TASK":
            return {
                ...state,
                [action.payload.groupId]: state[action.payload.groupId].filter(t => t.id !== action.payload.taskId)
            };

        case "CONFIRM_DELETE_TASK":
            if (!action.payload.confirmed) return state;
            return {
                ...state,
                [action.payload.groupId]: state[action.payload.groupId].filter(t => t.id !== action.payload.taskId)
            };


        case "TOGGLE_TASK":
            return {
                ...state,
                [action.payload.groupId]: state[action.payload.groupId].map(t =>
                    t.id === action.payload.taskId ? { ...t, completed: !t.completed } : t
                )
            };

        case "REORDER_TASK": {
            const { groupId, fromIndex, toIndex } = action.payload;
            const list = [...(state[groupId] || [])];
            if (fromIndex === toIndex) return state;
            if (fromIndex < 0 || toIndex < 0 || fromIndex >= list.length) return state;
            const [moved] = list.splice(fromIndex, 1);
            if (!moved) return state;
            const clamped = Math.max(0, Math.min(toIndex, list.length));
            list.splice(clamped, 0, moved);
            return {
                ...state,
                [groupId]: list
            };
        }

        case "MOVE_TASK": {
            const { fromGroupId, toGroupId, taskId, toIndex } = action.payload;

            // El reorden dentro del mismo grupo lo gestiona REORDER_TASK
            if (fromGroupId === toGroupId) return state;

            const source = [...(state[fromGroupId] || [])];
            const dest = [...(state[toGroupId] || [])];
            const fromIdx = source.findIndex(t => t.id === taskId);
            if (fromIdx === -1) return state;

            const [taskToMove] = source.splice(fromIdx, 1);
            if (!taskToMove) return state;

            const insertAt = toIndex === undefined
                ? dest.length
                : Math.max(0, Math.min(toIndex, dest.length));
            dest.splice(insertAt, 0, taskToMove);

            return {
                ...state,
                [fromGroupId]: source,
                [toGroupId]: dest
            };
        }



        case "SET_PRIORITY_TASK":
            return {
                ...state,
                [action.payload.groupId]: (state[action.payload.groupId] || []).map(t =>
                    t.id === action.payload.taskId ? { ...t, priority: action.payload.priority } : t
                )
            };

        case "CLEAR_PRIORITY_TASK":
            return {
                ...state,
                [action.payload.groupId]: (state[action.payload.groupId] || []).map(t => {
                    if (t.id !== action.payload.taskId) return t;
                    const next = { ...t };
                    delete next.priority;
                    return next;
                })
            };

        case "DELETE_GROUP_TASKS": {
            const next = { ...state };
            delete next[action.payload.groupId];
            return next;
        }

        case "HYDRATE_TASKS":
        case "SET_TASKS":
            return action.payload.tasks;

        default:
            return state;
    }
};

export default useTasksReducer
