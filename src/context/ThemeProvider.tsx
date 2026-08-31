// Crea el contexto de tema y aplica la clase "dark" al <html> para habilitar estilos oscuros

import { useState, useEffect } from "react"
import { ThemeContext } from "./ThemeContext"
import type { Theme } from "../types/ThemeType"

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {

    const [theme, setTheme] = useState<Theme>("light")

    const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

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