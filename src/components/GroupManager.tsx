import { useContext, useEffect, useReducer, useState } from "react"
import useGroupsReducer from "../hooks/useGroupsReducer";
import GroupBox from "./Groupbox";
import DataControls from "./DataControls";
import TrashDrawer from "./TrashDrawer";
import { TasksContext } from "../context/TasksContext";
import { TrashContext } from "../context/TrashContext";
import { loadJSON, saveJSON, STORAGE_KEYS } from "../utils/storage";
import type { Group, GroupAction } from "../types/contracts";

const GroupManager = () => {

    const { tasks, dispatchTasks } = useContext(TasksContext)!;
    const { trash, dispatchTrash, isTrashOpen, setTrashOpen } = useContext(TrashContext)!;

    // Carga diferida desde localStorage
    const [groups, dispatchGroupsBase] = useReducer(
        useGroupsReducer,
        undefined,
        () => loadJSON<Group[]>(STORAGE_KEYS.groups, []),
    );

    useEffect(() => {
        saveJSON(STORAGE_KEYS.groups, groups);
    }, [groups]);

    // Migración puntual: elimina tareas huérfanas de versiones sin borrado en cascada
    useEffect(() => {
        const valid = new Set(groups.map((g) => g.id));
        for (const key of Object.keys(tasks)) {
            if (!valid.has(key)) {
                dispatchTasks({ type: "DELETE_GROUP_TASKS", payload: { groupId: key } });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Archiva el snapshot del grupo + sus tareas antes de eliminarlo
    const archiveGroup = (id: string) => {
        const group = groups.find((g) => g.id === id);
        if (!group) return;
        dispatchTrash({
            type: "TRASH_GROUP",
            payload: { group, tasks: tasks[id] || [] },
        });
    };

    // Borrado en cascada: archiva en papelera y eliminar el grupo también elimina sus tareas
    const dispatchgroup = (action: GroupAction) => {
        if (action.type === "DELETE_GROUP") {
            archiveGroup(action.payload.id);
            dispatchTasks({ type: "DELETE_GROUP_TASKS", payload: { groupId: action.payload.id } });
        }
        if (action.type === "CONFIRM_DELETE_GROUP" && action.payload.comfirmed) {
            archiveGroup(action.payload.id);
            dispatchTasks({ type: "DELETE_GROUP_TASKS", payload: { groupId: action.payload.id } });
        }
        dispatchGroupsBase(action);
    };

    // --- Restauración desde papelera ---
    const ensureGroupExists = (groupId: string, groupName?: string) => {
        if (groups.some((g) => g.id === groupId)) return;
        dispatchGroupsBase({
            type: "RESTORE_GROUP",
            payload: { group: { id: groupId, name: groupName ?? "Grupo recuperado", tasks: [] } },
        });
    };

    const handleRestoreGroup = (id: string) => {
        const snapshot = trash.groups.find((g) => g.group.id === id);
        if (!snapshot) return;
        dispatchGroupsBase({ type: "RESTORE_GROUP", payload: { group: snapshot.group } });
        dispatchTasks({
            type: "RESTORE_GROUP_TASKS",
            payload: { groupId: snapshot.group.id, tasks: snapshot.tasks },
        });
        dispatchTrash({ type: "RESTORE_GROUP", payload: { id } });
    };

    const handleRestoreTask = (groupId: string, taskId: string) => {
        const entry = trash.tasks.find((t) => t.groupId === groupId && t.task.id === taskId);
        if (!entry) return;
        ensureGroupExists(groupId, entry.groupName);
        dispatchTasks({ type: "RESTORE_TASK", payload: { groupId, task: entry.task } });
        dispatchTrash({ type: "RESTORE_TASK", payload: { groupId, taskId } });
    };

    const handleRestoreAllGroups = () => {
        for (const snapshot of trash.groups) {
            dispatchGroupsBase({ type: "RESTORE_GROUP", payload: { group: snapshot.group } });
            dispatchTasks({
                type: "RESTORE_GROUP_TASKS",
                payload: { groupId: snapshot.group.id, tasks: snapshot.tasks },
            });
        }
        dispatchTrash({ type: "RESTORE_ALL_GROUPS" });
    };

    const handleRestoreAllTasks = () => {
        const restoredGroupIds = new Set(groups.map((g) => g.id));
        for (const entry of trash.tasks) {
            if (!restoredGroupIds.has(entry.groupId)) {
                dispatchGroupsBase({
                    type: "RESTORE_GROUP",
                    payload: {
                        group: { id: entry.groupId, name: entry.groupName ?? "Grupo recuperado", tasks: [] },
                    },
                });
                restoredGroupIds.add(entry.groupId);
            }
            dispatchTasks({ type: "RESTORE_TASK", payload: { groupId: entry.groupId, task: entry.task } });
        }
        dispatchTrash({ type: "RESTORE_ALL_TASKS" });
    };

    const handleRestoreAll = () => {
        const restoredGroupIds = new Set(groups.map((g) => g.id));
        for (const snapshot of trash.groups) {
            dispatchGroupsBase({ type: "RESTORE_GROUP", payload: { group: snapshot.group } });
            dispatchTasks({
                type: "RESTORE_GROUP_TASKS",
                payload: { groupId: snapshot.group.id, tasks: snapshot.tasks },
            });
            restoredGroupIds.add(snapshot.group.id);
        }
        for (const entry of trash.tasks) {
            if (!restoredGroupIds.has(entry.groupId)) {
                dispatchGroupsBase({
                    type: "RESTORE_GROUP",
                    payload: {
                        group: { id: entry.groupId, name: entry.groupName ?? "Grupo recuperado", tasks: [] },
                    },
                });
                restoredGroupIds.add(entry.groupId);
            }
            dispatchTasks({ type: "RESTORE_TASK", payload: { groupId: entry.groupId, task: entry.task } });
        }
        dispatchTrash({ type: "RESTORE_ALL" });
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

            <div className="grid grid-cols-4 gap-4 items-start overflow-y-auto overflow-x-hidden max-h-100 pr-2 pb-4 [scrollbar-width:thin]">
                {groups.map((group) => (
                    <GroupBox
                        key={group.id}
                        group={group}
                        groups={groups}
                        dispatchGroups={dispatchgroup}
                    />
                ))}
            </div>

            <TrashDrawer
                open={isTrashOpen}
                onClose={() => setTrashOpen(false)}
                trash={trash}
                onRestoreGroup={handleRestoreGroup}
                onRestoreTask={handleRestoreTask}
                onRestoreAllGroups={handleRestoreAllGroups}
                onRestoreAllTasks={handleRestoreAllTasks}
                onRestoreAll={handleRestoreAll}
                onPurgeGroup={(id) => dispatchTrash({ type: "PURGE_GROUP", payload: { id } })}
                onPurgeTask={(groupId, taskId) =>
                    dispatchTrash({ type: "PURGE_TASK", payload: { groupId, taskId } })
                }
                onEmptyTrash={() => dispatchTrash({ type: "EMPTY_TRASH" })}
            />
        </div>
    );
};


export default GroupManager
