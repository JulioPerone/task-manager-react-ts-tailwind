import React, { useState } from "react"

const CreateGroup = () => {

    const [nameGroup, setNameGroup] = useState<string>("");
    const [groups, setGroup] = useState<string[]>([]);

    const handleAddGroup = () => {
        if (nameGroup.trim() === "") return;
        setGroup([...groups, nameGroup]);
        setNameGroup("");
    };


    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-2">Crear un grupo</h1>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={nameGroup}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNameGroup(e.target.value)}
                    placeholder="Nombre del grupo"
                    className="border rounded-2xl p-2"
                />
                <button onClick={handleAddGroup}
                className="bg-green-300 text-neutral-800 px-4 py-2 rounded-2xl"
                >
                    +
                </button>           
            </div>

            <div className="border-2 border-dashed border-green-500 p-4 rounded-xl">
                {groups.map((group, index) => (
                    <div key={index}
                    className="border border-green-400 rounded-2xl p-2 mb-2"
                    >
                        {group}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CreateGroup