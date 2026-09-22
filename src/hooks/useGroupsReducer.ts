import type { Group, GroupAction } from "../types/contracts";

const useGroupsReducer = ( state: Group[], action: GroupAction): Group[] => {
  switch (action.type) {
    case "ADD_GROUP":
        return [...state, { id: crypto.randomUUID(), name: action.payload.name, tasks: [] }];

    case "EDIT_GROUP_NAME":
        return state.map(g => g.id === action.payload.id ? { ...g, name: action.payload.name } : g
        );

    case "DELETE_GROUP":
        return state.filter(g => g.id !== action.payload.id);

    case "CONFIRM_DELETE_GROUP":
        if (!action.payload.comfirmed) return state;    
        return state.filter(g => g.id !== action.payload.id); 

    case "HYDRATE_GROUPS":
    case "SET_GROUPS":
        return action.payload.groups;
        
    default:
        return state;
  }
};

export default useGroupsReducer