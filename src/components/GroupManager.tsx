import { useContext, useEffect, useReducer, useState } from "react"
import useGroupsReducer from "../hooks/useGroupsReducer";
import GroupBox from "./Groupbox";
import DataControls from "./DataControls";
import { TasksContext } from "../context/TasksContext";
import { loadJSON, saveJSON, STORAGE_KEYS } from "../utils/storage";
import type { Group, GroupAction } from "../types/contracts";

const GroupManager = () => {

    const { tasks, dispatchTasks } = useContext(TasksContext)!;

    const [groups, dispatchGroupsBase] = useReducer(
        useGroupsReducer,
        undefined,
        () => loadJSON<Group[]>(STORAGE_KEYS.groups, []),
    );

    // Persistencia LocalStorage: los grupos sobreviven al refrescar
    useEffect(() => {
        saveJSON(STORAGE_KEYS.groups, groups);
    }, [groups]);

    // Limpieza única de tareas huérfanas (de versiones previas sin borrado en cascada)
    useEffect(() => {
        const valid = new Set(groups.map((g) => g.id));
        for (const key of Object.keys(tasks)) {
            if (!valid.has(key)) {
                dispatchTasks({ type: "DELETE_GROUP_TASKS", payload: { groupId: key } });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Envuelve el dispatch para borrar en cascada las tareas del grupo eliminado
    const dispatchgroup = (action: GroupAction) => {
        if (action.type === "DELETE_GROUP") {
            dispatchTasks({ type: "DELETE_GROUP_TASKS", payload: { groupId: action.payload.id } });
        }
        if (action.type === "CONFIRM_DELETE_GROUP" && action.payload.comfirmed) {
            dispatchTasks({ type: "DELETE_GROUP_TASKS", payload: { groupId: action.payload.id } });
        }
        dispatchGroupsBase(action);
    };

    const [newGroupName, setNewGroupName] = useState("");

    const handleAddGroup = () => {
        if (!newGroupName.trim()) return;
        dispatchgroup({ type: "ADD_GROUP", payload: { name: newGroupName } });
        setNewGroupName("");
    };


    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Gestión de Grupos</h2>

            <DataControls
                groups={groups}
                tasks={tasks}
                dispatchGroups={dispatchgroup}
                dispatchTasks={dispatchTasks}
            />

            {/* Input principal para crear grupos */}
            <div className="flex gap-2 mb-6">
                <input
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Nombre del grupo"
                    className="border rounded-2xl p-2 w-1/3"
                />
                <button
                    onClick={handleAddGroup}
                    className= "text-white py-1 rounded"
                >
                    <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/add--v1.png" alt="add--v1"/>
                </button>
            </div>

            {/* Renderizado de grupos con scroll vertical nativo */}
            <div className="grid grid-cols-4 gap-4 items-start overflow-y-auto overflow-x-hidden max-h-100 pr-2 pb-4 [scrollbar-width:thin]">
                {groups.map((group) => (
                    <GroupBox
                        key={group.id}
                        group={group}
                        groups={groups} // 👈 ahora se pasa aquí
                        dispatchGroups={dispatchgroup}
                    />
                ))}
            </div>
        </div>
    );
};


export default GroupManager
