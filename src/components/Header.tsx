import DarkLightTheme from "./DarkLightTheme"

const Header = () => {
    
    
    return (
        <div className="relative flex flex-col 
        justify-center items-center gap-4 mt-5 p-4">
            <h1 className="font-lexend font-bold  text-skin text-4xl uppercase">To Do List App</h1>
            <p className="font-lexend italic text-skin">Version 1.1.0: Gestión modular de tareas por grupo</p>
            <DarkLightTheme />
        </div>
    )
}

export default Header