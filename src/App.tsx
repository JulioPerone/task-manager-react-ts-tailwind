import { TasksProvider } from "./context/TasksProvider"
import ThemeProvider from "./context/ThemeProvider"
import MyRoutes from "./routes/MyRoutes"

const App = () => {
  return (
    <ThemeProvider>
      <TasksProvider>
        <MyRoutes />
      </TasksProvider>
    </ThemeProvider>
  )
}

export default App
