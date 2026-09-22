import DarkLightTheme from "./DarkLightTheme"

const Header = () => {
    
    
    return (
        <div className="relative flex flex-col 
        justify-center items-center gap-4 mt-5 p-4">
            <h1 className="font-lexend font-bold  text-skin text-4xl uppercase">To Do List App - v1.2.0</h1>
            <p className="font-lexend italic text-skin">Gestión modular de grupos, ahora puedes exportar e importar todos tus grupos</p>
            <DarkLightTheme />
        </div>
    )
}

export default Header