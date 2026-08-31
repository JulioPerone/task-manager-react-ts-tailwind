export type Group = {
    id: string;
    name: string;
    tasks: Task[];
};

export type Task = {
    id: string;
    title: string;
}