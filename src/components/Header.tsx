import DarkLightTheme from "./DarkLightTheme"

const Header = () => {
    
    
    return (
        <div className="relative flex flex-col 
        justify-center items-center gap-4 mt-5 border rounded-2xl p-4">
            <h1>To Do List App</h1>
            <p>Version 1.1.0: mas organizado con grupos y sistema de prioridades</p>
            <DarkLightTheme />
        </div>
    )
}

export default Header