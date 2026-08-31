// Componente principal para la creación modular de grupos
// Permite añadir grupos independientes y gestionar sus tareas

import React, { useState } from "react"
import type { Group, Task } from "../types/GroupsForTask";
import GroupBox from "./Groupbox";

const CreateGroup = () => {

    const [nameGroup, setNameGroup] = useState<string>("");

    const [groups, setGroups] = useState<Group[]>([]);

    const updateGroupTasks = (id: string, newTasks: Task[]) => {
        setGroups(groups.map(g => g.id === id ? { ...g, tasks: newTasks } : g));
    };

    // Maneja la creacion de un nuevo grupo
    const handleAddGroup = () => {
        if (!nameGroup.trim()) return;
        const newGroup: Group = {
            id: crypto.randomUUID(),
            name: nameGroup,
            tasks: []
        };
        setGroups([...groups, newGroup]);
        setNameGroup("");
    };


    return (
        <div className="p-4">
            <h1 className="font-lexend text-xl text-skin font-bold mb-2">Crear un grupo</h1>

            {/* Input + botón para añadir grupos */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={nameGroup}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNameGroup(e.target.value)}
                    placeholder="Nombre del grupo"
                    className="w-3/12 border border-neutral-800 input-skin text-skin rounded-2xl p-2 focus:outline-none focus:ring-2 focus:ring-amber-50"
                />
                <button onClick={handleAddGroup}
                    className="surface-skin text-2xl text-skin px-4 py-2 rounded-2xl font-bold transition"
                >
                    <span className="material-symbols-outlined">note_stack</span>
                </button>
            </div>
            {/* Contenedor scroll + grid para mostrar los grupos */}
            <div className="border-2 border-skin p-3 rounded-xl overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-4 gap-6 justify-items-center border-skin text-skin p-4">
                    {groups.map((group) => (
                        <GroupBox
                            key={group.id}
                            group={group}
                            updateGroup={updateGroupTasks}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CreateGroup