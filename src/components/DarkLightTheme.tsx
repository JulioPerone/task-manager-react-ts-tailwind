import { useState } from "react"

const DarkLightTheme = () => {
    
    const [isDark, setIsDark] = useState<boolean>(false);
    
    return (
        <div className="absolute top-4 right-8 text-2xl border rounded-2xl p-1">
            <button onClick={() => setIsDark(!isDark)}>
                {isDark ? "🌙" : "☀️"}
            </button>
        </div>
    );
}

export default DarkLightTheme