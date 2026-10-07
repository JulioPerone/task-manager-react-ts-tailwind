import { TasksProvider } from "./context/TasksProvider"
import { TrashProvider } from "./context/TrashProvider"
import ThemeProvider from "./context/ThemeProvider"
import MyRoutes from "./routes/MyRoutes"

const App = () => {
  return (
    <ThemeProvider>
      <TrashProvider>
        <TasksProvider>
          <MyRoutes />
        </TasksProvider>
      </TrashProvider>
    </ThemeProvider>
  )
}

export default App
