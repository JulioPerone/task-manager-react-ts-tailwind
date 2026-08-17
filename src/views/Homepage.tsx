import CreateGroup from "../components/CreateGroup"
import Footer from "../components/Footer"
import Header from "../components/Header"

const Homepage = () => {

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Header />
      </header>
      <main className="grow">
        <section>
            <CreateGroup />
        </section>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default Homepage