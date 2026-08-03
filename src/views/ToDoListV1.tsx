import { Link } from "react-router-dom"
import FormTasks from "../components/FormTasks"

const ToDoListV1 = () => {
    return (
        <div>
            <Link to="/" className="text-3xl">⬅️</Link>
            <h1 className="uppercase font-bold text-3xl flex justify-center">Mini-Proyecto: To Do list - Version 1.0</h1>
            <section>
                <h2 className="uppercase flex justify-center my-3">Crear Tareas</h2>
                <article>
                    <FormTasks />
                </article>

            </section>
        </div>
    )
}

export default ToDoListV1