import { useContext } from "react"
import DarkLightTheme from "./DarkLightTheme"
import TrashButton from "./TrashButton"
import { TrashContext } from "../context/TrashContext"

const Header = () => {
    const trashCtx = useContext(TrashContext);
    const count = trashCtx
        ? trashCtx.trash.groups.length + trashCtx.trash.tasks.length
        : 0;

    return (
        <div className="relative flex flex-col 
        justify-center items-center gap-4 mt-5 p-4">
            <h1 className="font-lexend font-bold  text-skin text-4xl uppercase">To Do List App - v1.3.0</h1>
            <p className="font-lexend italic text-skin">Gestión modular de grupos, Drag & Drop, filtros y papelera añadidos</p>
            <div className="absolute top-1 right-8 flex flex-col items-center gap-1 p-3">
                <DarkLightTheme />
                <TrashButton count={count} onClick={() => trashCtx?.setTrashOpen(true)} />
            </div>
        </div>
    )
}

export default Header