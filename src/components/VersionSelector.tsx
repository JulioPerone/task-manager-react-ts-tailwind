import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaChevronDown } from "react-icons/fa";


const VersionSelector = () => {

    const navigate = useNavigate();
    const [version, setVersion] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedVersion = e.target.value;
        setVersion(selectedVersion)
        navigate(`/v${selectedVersion}`) //Vistas dinamicas
    };

    return (
        <div className="flex justify-center items-center gap-2 p-4 mt-3 bg-amber-200 rounded-xl">
            <label htmlFor="version" className="font-bold text-lg">
                VERSION
            </label>

            <div className="relative">
                <select
                    id="version"
                    value={version}
                    onChange={handleChange}
                    className="appearance-none border-2 rounded-xl p-2 bg-white cursor-pointer pr-8 transition-all duration-200 hover:scale-105"
                >
                    <option value="">Seleccionar...</option>
                    <option value="1.0">1.0</option>
                    <option value="1.2">1.2</option>
                </select>
                <FaChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none"
                />
            </div>
        </div>
    );
}

export default VersionSelector