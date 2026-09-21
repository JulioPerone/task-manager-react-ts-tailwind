// Contratos para Grupos y Tareas

export type Task = {
    id: string;
    title: string;
    completed: boolean;
    priority?: "low" | "medium" | "high" | "very important"
}


export type Group = {
    id: string;
    name: string;
    tasks: Task[],
}

// Acciones para Grupos y Tareas

export type GroupAction = 
| { type: "ADD_GROUP"; payload: { name: string }}
| { type: "EDIT_GROUP_NAME"; payload: { id: string; name: string }}
| { type: "DELETE_GROUP"; payload: { id: string }}
| { type: "CONFIRM_DELETE_GROUP", payload: { id:string; comfirmed: boolean }}
| { type: "HYDRATE_GROUPS"; payload: { groups: Group[] } }
| { type: "SET_GROUPS"; payload: { groups: Group[] } };

export type TaskAction = 
| { type: "ADD_TASK"; payload: { groupId: string ; title: string }}
| { type: "EDIT_TASK"; payload: { groupId: string; taskId:string; title: string }}
| { type: "DELETE_TASK"; payload: { groupId: string; taskId:string }}
| { type: "CONFIRM_DELETE_TASK"; payload: { groupId: string; taskId: string, confirmed: boolean }}
| { type: "TOGGLE_TASK"; payload: { groupId: string; taskId: string }}
| { type: "MOVE_TASK"; payload: { fromGroupId: string; toGroupId: string; taskId: string }}
| { type: "SET_PRIORITY_TASK"; payload: { groupId: string; taskId: string; priority: "low" | "medium" | "high" | "very important" }}
| { type: "DELETE_GROUP_TASKS"; payload: { groupId: string } }
| { type: "HYDRATE_TASKS"; payload: { tasks: Record<string, Task[]> } }
| { type: "SET_TASKS"; payload: { tasks: Record<string, Task[]> } }
