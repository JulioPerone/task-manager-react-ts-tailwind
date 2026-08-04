export type Task = {
    id: number;
    text: string;
}

export type Tasks = Task[];

export type Actions =
| { type: "CREATE"; payload: string }
| { type: "EDIT"; payload: Task }
| { type: "DELETE"; payload: number }
| { type: "CANCEL" };