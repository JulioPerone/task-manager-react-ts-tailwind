// Crea el contexto de tema y aplica la clase "dark" al <html> para habilitar estilos oscuros

import { useState, useEffect } from "react"
import { ThemeContext } from "./ThemeContext"
import type { Theme } from "../types/ThemeType"
import { loadJSON, saveJSON, STORAGE_KEYS } from "../utils/storage"

const isTheme = (value: unknown): value is Theme =>
    value === "light" || value === "dark";

const loadTheme = (): Theme => {
    const stored = loadJSON<unknown>(STORAGE_KEYS.theme, "light");
    return isTheme(stored) ? stored : "light";
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {

    const [theme, setTheme] = useState<Theme>(loadTheme)

    const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

    // Persiste el tema para que sobreviva al refrescar
    useEffect(() => {
        saveJSON(STORAGE_KEYS.theme, theme);
    }, [theme]);

    // Aplica o remueve la clase "dark" en el <html> según el estado actual del tema
    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark")
        } else {
            root.classList.remove("dark");
        }
    }, [theme]);


    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider