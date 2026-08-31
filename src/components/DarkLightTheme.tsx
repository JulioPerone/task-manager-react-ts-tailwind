// Toggle de tema Claro/Oscuro usando el contexto creado

import { useTheme } from "../context/ThemeContext";

const DarkLightTheme = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="absolute top-1 right-8 flex flex-col items-center justify-center gap-1 p-3">
            <button onClick={toggleTheme}>
                {theme === "dark" ? (
                    <span className="material-symbols-outlined text-7xl hover:bg-blue-400 p-3 rounded-3xl">dark_mode</span>
                ) : (
                    <span className="material-symbols-outlined text-7xl hover:bg-amber-400 p-3 rounded-3xl">light_mode</span>
                )}
            </button>
        </div>
    );
};

export default DarkLightTheme;
