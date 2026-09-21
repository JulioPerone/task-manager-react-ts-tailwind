import Footer from "../components/Footer"
import GroupManager from "../components/GroupManager"
import Header from "../components/Header"

const Homepage = () => {

  return (
    <div className="flex flex-col min-h-screen bg-skin transition-all duration-500">
      <header>
        <Header />
      </header>
      <main className="grow">
        <section>
            <GroupManager />
        </section>
      </main>
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  )
}

export default Homepage