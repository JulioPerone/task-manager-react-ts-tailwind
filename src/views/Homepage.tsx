import ToDoListApp from "./ToDoListApp"

const Homepage = () => {
  return (
    <main>
      <section>
        <header>
          <h1 className="uppercase text-3xl font-bold flex justify-center mt-4">
            ToDo List App
          </h1>
        </header>
        <ToDoListApp />
      </section>
    </main>
  )
}

export default Homepage
