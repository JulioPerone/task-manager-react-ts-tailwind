import ToDoListApp from "./ToDoListApp"

const Homepage = () => {
  return (
    <main className="min-h-screen bg-linear-to-br from-yellow-50 via-orange-200 to-indigo-400 flex flex-col items-center justify-start py-10">
      <section className="w-full max-w-2xl bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-yellow-200">
        <header className="text-center mb-6">
          <h1 className="uppercase text-4xl font-extrabold text-orange-400 tracking-wide drop-shadow-sm">
            To-Do List App
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Organiza tus tareas y conquista el día!
          </p>
        </header>
        <ToDoListApp />
      </section>
    </main>
  )
}

export default Homepage
