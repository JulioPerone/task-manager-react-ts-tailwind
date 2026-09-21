
const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row justify-between items-center gap-4 mb-3 p-4 text-skin">
      {/* Izquierda: Icons8 link */}
      <div className="flex flex-col items-center md:items-start gap-1 md:w-1/3">
        <p className="text-sm">Iconos por Icons8</p>
        <a
          href="https://icons8.com"
          target="_blank"
          className="surface-skin px-3 py-1 rounded text-sm font-medium hover:opacity-90 transition"
        >
          Visitar Icons8
        </a>
      </div>

      {/* Centro: Copyright + Licencia */}
      <div className="flex flex-col items-center gap-1 text-center md:w-1/3">
        <h1>Copyright © 2026 Julio Perone</h1>
        <p>Licencia MIT</p>
      </div>

      {/* Derecha: Mis redes sociales */}
      <div className="flex flex-col items-center md:items-end gap-2 md:w-1/3">
        <div className="flex flex-col items-center gap-2">
          <p className="text-center">Mis redes sociales</p>
          <div className="flex justify-center gap-2">
            <a href="" target="_blank" aria-label="Github">
              <img src="https://img.icons8.com/?size=100&id=12599&format=png&color=000000"
              width="40" height="40" alt="Github icon" />
            </a>
            <a href="" target="_blank" aria-label="LinkedIn">
              <img src="https://img.icons8.com/?size=100&id=8808&format=png&color=000000"
              width="40" height="40" alt="LinkedIn icon" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer