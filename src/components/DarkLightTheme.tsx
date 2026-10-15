import { useTheme } from "../context/ThemeContext";

const DarkLightTheme = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex flex-col items-center justify-center gap-1">
            <button onClick={toggleTheme} className="touch-44 flex items-center justify-center rounded-3xl transition-colors">
                {theme === "dark" ? (
                    <span className="material-symbols-outlined text-3xl sm:text-4xl leading-none hover:bg-blue-400 p-2 sm:p-3 rounded-3xl">dark_mode</span>
                ) : (
                    <span className="material-symbols-outlined text-3xl sm:text-4xl leading-none hover:bg-amber-400 p-2 sm:p-3 rounded-3xl">light_mode</span>
                )}
            </button>
        </div>
    );
};

export default DarkLightTheme;
