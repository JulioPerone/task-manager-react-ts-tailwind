import ThemeProvider from "./context/ThemeProvider"
import MyRoutes from "./routes/MyRoutes"

const App = () => {
  return (
    <ThemeProvider>
      <MyRoutes />
    </ThemeProvider>
  )
}

export default App
