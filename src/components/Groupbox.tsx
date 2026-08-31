// Componente que representa un grupo como una "caja"
// Contiene el nombre del grupo y las tareas asociadas (renderizadas con TaskGroups)

import type { Group, Task } from "../types/GroupsForTask";
import TaskGroups from "./TaskGroups";

const GroupBox = ({ group, updateGroup }: { group: Group; updateGroup: (id: string, newTasks: Task[]) => void }) => {
    return (
        <div className= "rounded-xl p-4 shadow-sm hover:shadow-md transition inner-skin">
            <h2 className="font-bold">{group.name}</h2>
            
            {/* Componente hijo encargado de manejar las tareas del grupo */}
            <TaskGroups
                tasks={group.tasks}
                onUpdate={(newTasks) => updateGroup(group.id, newTasks)}
            />
        </div>
    );
};

export default GroupBox;
