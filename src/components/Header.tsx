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
        justify-center items-center gap-3 sm:gap-4 mt-4 sm:mt-5 px-4 pt-2 pb-4 text-center">
            <h1 className="font-lexend font-bold text-skin uppercase fluid-h1 leading-tight px-12 sm:px-0">To Do List App - v1.3.0</h1>
            <p className="font-lexend italic text-skin text-sm sm:text-base max-w-xl">Gestión modular de grupos, Drag & Drop, filtros, papelera y diseño responsive</p>
            <div className="absolute top-1 right-2 sm:right-8 flex flex-row sm:flex-col items-center gap-2 p-2 sm:p-3">
                <DarkLightTheme />
                <TrashButton count={count} onClick={() => trashCtx?.setTrashOpen(true)} />
            </div>
        </div>
    )
}

export default Header