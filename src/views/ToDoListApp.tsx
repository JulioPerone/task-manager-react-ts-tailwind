import FormTasks from "../components/FormTasks"

const ToDoListApp = () => {
    return (
        <div>
            <section>
                <h2 className="uppercase flex justify-center my-3">Crear Tareas</h2>
                <article>
                    <FormTasks />
                </article>

            </section>
        </div>
    )
}

export default ToDoListApp