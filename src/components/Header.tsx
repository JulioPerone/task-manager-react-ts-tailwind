import { useContext } from "react"
import DarkLightTheme from "./DarkLightTheme"
import TrashButton from "./TrashButton"
import TutorialButton from "./TutorialButton"
import { TrashContext } from "../context/TrashContext"

const Header = () => {
    const trashCtx = useContext(TrashContext);
    const count = trashCtx
        ? trashCtx.trash.groups.length + trashCtx.trash.tasks.length
        : 0;

    return (
        <div className="relative flex flex-col 
        justify-center items-center gap-3 sm:gap-4 mt-4 sm:mt-5 px-4 pt-2 pb-4 text-center">
            <h1 className="font-lexend font-bold text-skin uppercase fluid-h1 leading-tight text-balance break-words max-w-full px-2 pr-24 sm:px-20">To Do List App - v1.3.0</h1>
            <p className="font-lexend italic text-skin text-sm sm:text-base max-w-xl px-2 sm:px-0">Gestión modular de grupos, Drag & Drop, filtros, papelera y diseño responsive</p>
            <div className="absolute top-0 right-1 sm:top-1 sm:right-8 flex flex-row sm:flex-col items-center gap-1 sm:gap-2 p-1 sm:p-3">
                <DarkLightTheme />
                <TrashButton count={count} onClick={() => trashCtx?.setTrashOpen(true)} />
                <TutorialButton />
            </div>
        </div>
    )
}

export default Header