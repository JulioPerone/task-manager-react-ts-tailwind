import { createContext, useContext } from "react"
import type { Theme } from "../types/ThemeType"

export const ThemeContext = createContext<{
    theme: Theme;
    toggleTheme: () => void;
}>({
    theme: "light",
    toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext);