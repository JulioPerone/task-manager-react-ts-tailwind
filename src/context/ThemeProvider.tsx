// Tema global con persistencia + sincronización de la clase "dark" en <html>
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

    useEffect(() => {
        saveJSON(STORAGE_KEYS.theme, theme);
    }, [theme]);

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