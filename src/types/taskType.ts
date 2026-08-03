//Tarea individual
export type Task = {
    id: number;
    text: string;
}

//Lista de tareas
export type Tasks = Task[];

export type Actions =
| { type: "CREATE"; payload: string }
| { type: "EDIT"; payload: Task }
| { type: "DELETE"; payload: number }
| { type: "CANCEL" };