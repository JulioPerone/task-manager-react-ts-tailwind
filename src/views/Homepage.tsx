import Footer from "../components/Footer"
import GroupManager from "../components/GroupManager"
import Header from "../components/Header"

const Homepage = () => {

  return (
    <div className="flex flex-col min-h-screen bg-skin transition-all duration-500 overflow-x-hidden">
      <header>
        <Header />
      </header>
      <main className="grow w-full max-w-app mx-auto px-3 sm:px-6 lg:px-8">
        <section>
            <GroupManager />
        </section>
      </main>
      <footer className="mt-auto w-full max-w-app mx-auto px-3 sm:px-6 pb-safe">
        <Footer />
      </footer>
    </div>
  )
}

export default Homepage