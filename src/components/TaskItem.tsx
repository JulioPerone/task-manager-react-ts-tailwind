import TaskMenu from "./TaskMenu";
import type { Task, Group, TaskAction } from "../types/contracts";

type Props = {
    task: Task;
    groupId: string;
    groups: Group[];
    dispatchTasks: React.Dispatch<TaskAction>;
};

const TaskItem = ({ task, groupId, groups, dispatchTasks }: Props) => {

    const priorityStyles = {
        low: "bg-green-300 border-green-600 text-green-800 font-bold",
        medium: "bg-yellow-300 border-yellow-600 text-yellow-800 font-bold",
        high: "bg-red-300 border-red-600 text-red-800 font-bold",
        "very important": "bg-pink-400 border-pink-600 text-pink-800 font-bold",
    };

    const styleClass = task.priority
        ? priorityStyles[task.priority as keyof typeof priorityStyles]
        : "task-default";

    return (
        <div
            className={`flex items-center justify-between border rounded-2xl p-3 mb-2 transition-all duration-300 ease-in-out animate-fadeIn ${styleClass}`}
        >
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                        dispatchTasks({ type: "TOGGLE_TASK", payload: { groupId, taskId: task.id } })
                    }
                />
                <span className={`${task.completed ? "line-through opacity-60" : ""}`}>
                    {task.title}
                </span>
            </div>

            <TaskMenu
                task={task}
                groupId={groupId}
                groups={groups}
                dispatchTasks={dispatchTasks}
            />
        </div>
    );
};

export default TaskItem