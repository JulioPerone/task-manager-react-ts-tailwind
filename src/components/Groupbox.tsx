import { useEffect, useRef, useState } from "react";
import type { Group, GroupAction } from "../types/contracts";
import TaskManager from "./TaskManager";

type GroupBoxProps = {
    group: Group;
    groups: Group[];
    dispatchGroups: React.Dispatch<GroupAction>;
};

export const GroupBox = ({ group, groups, dispatchGroups }: GroupBoxProps) => {

    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(group.name);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleEditName = () => {
        setIsEditing(true);
        setShowMenu(false);
    };

    const handleSaveName = () => {
        if (!editedName.trim()) return;
        dispatchGroups({ type: "EDIT_GROUP_NAME", payload: { id: group.id, name: editedName } });
        setIsEditing(false);
    };

    const handleDelete = () => {
        setConfirmDelete(true);
        setShowMenu(false);
    };

    const handleConfirmDelete = () => {
        dispatchGroups({ type: "CONFIRM_DELETE_GROUP", payload: { id: group.id, comfirmed: true } });
        setConfirmDelete(false);
    };

    const handleCancelDelete = () => {
        setConfirmDelete(false);
    };

    return (
        <div className="rounded-lg p-3 relative">
            <div className="flex justify-between items-center mb-4">
                {isEditing ? (
                    <>
                        <input
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="border rounded p-1 w-full mr-2"
                        />
                        <button
                            onClick={handleSaveName}
                            className="surface-skin text-white px-3 py-1 rounded"
                        >
                            Guardar
                        </button>
                    </>
                ) : (
                    <>
                        <h3 className="font-bold">{group.name}</h3>

                        <div ref={menuRef} className="relative">
                            {!showMenu ? (
                                <button
                                    onClick={() => setShowMenu(true)}
                                    className="material-symbols-outlined"
                                >
                                    more_vert
                                </button>
                            ) : (
                                <div
                                    className="bg-neutral-800/50 backdrop-blur-sm text-white rounded-lg shadow-lg 
                             p-2 flex justify-center gap-3 animate-slideIn transition-all duration-200"
                                >
                                    <button
                                        onClick={handleEditName}
                                        title="Editar nombre"
                                        className="hover:bg-neutral-800 p-1 rounded transition-transform hover:scale-110"
                                    >
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        title="Eliminar grupo"
                                        className="hover:bg-neutral-700 p-1 rounded transition-transform hover:scale-110"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {confirmDelete && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white text-black p-4 rounded shadow-lg">
                        <p className="mb-3">¿Estás seguro de eliminar este grupo?</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={handleConfirmDelete}
                                className="bg-red-600 text-white px-3 py-1 rounded"
                            >
                                Aceptar
                            </button>
                            <button
                                onClick={handleCancelDelete}
                                className="bg-gray-400 text-black px-3 py-1 rounded"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <TaskManager groupId={group.id} groups={groups} />
        </div>
    );
}

export default GroupBox