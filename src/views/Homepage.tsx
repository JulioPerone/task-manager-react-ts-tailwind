import CreateGroup from "../components/CreateGroup"
import Footer from "../components/Footer"
import Header from "../components/Header"

const Homepage = () => {

  return (
    <div className="flex flex-col min-h-screen bg-skin transition-all duration-500">
      <header>
        <Header />
      </header>
      <main className="grow">
        <section>
            <CreateGroup />
        </section>
      </main>
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  )
}

export default Homepage