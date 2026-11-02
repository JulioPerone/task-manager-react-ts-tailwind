// Tutorial interactivo: vista IDÉNTICA a la app (mismos Header, GroupManager y
// Footer reales) pero envuelta en providers sandbox en memoria. Nada se guarda:
// al salir o repetir, la práctica se descarta.
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import GroupManager, { type SandboxSnapshot } from "../components/GroupManager";
import Header from "../components/Header";
import TutorialSandboxProviders from "../components/tutorial/TutorialSandboxProviders";

const EMPTY_SNAPSHOT: SandboxSnapshot = {
  groupCount: 0,
  taskCount: 0,
  completedCount: 0,
  trashCount: 0,
};

// Paso -> elemento real de la app a enfocar (spotlight vía CSS [data-active-tour])
const STEP_TARGET: Record<number, string | null> = {
  0: null,
  1: "group-input",
  2: "groups-list",
  3: "create-task",
  4: "task-menu",
  5: "trash",
  6: "task-toggle",
  7: "filter",
  8: "export-import",
  9: null,
};

const STEP_TITLE = [
  "Bienvenida",
  "Crea un grupo",
  "Tus grupos",
  "Crea tareas",
  "Acciones de tarea",
  "Papelera",
  "Completar tareas",
  "Filtrar por prioridad",
  "Exportar / Importar",
  "¡Tutorial completado!",
];

const STEP_TEXT = [
  "Te doy la bienvenida a tu organizador de tareas. ¿Quieres hacer un recorrido?",
  "Genial, empieza creando un grupo: escribe el nombre que quieras en el campo de arriba y pulsa +.",
  "Cada grupo que vayas creando se verá aquí, en esta cuadrícula.",
  "Haz click en «Crear tarea» dentro de tu grupo, luego crea dos más o las que quieras.",
  "Mira las diferentes acciones que puedes hacer con los tres puntos (⋮) de una tarea. Tócalo para ver el submenú en vivo.",
  "No te preocupes: los grupos y tareas que has eliminado los puedes recuperar aquí, en la papelera de arriba.",
  "Para tachar una tarea como completada, dale click al cuadradito. Puedes deshacerlo con otro click.",
  "Puedes filtrar las tareas por su prioridad con el embudo. Para volver, dale a «Todas».",
  "Para editar fuera de la app dale a «Exportar planilla» (se crea una planilla de cálculo). Para traerla de vuelta, «Importar planilla». Aquí es de mentira: nada se guarda.",
  "Excelente, has completado el tutorial. Si lo deseas repetir, dale click al botón del foco. ¡Que tengas un buen día!",
];

const ACTION_LEGEND = [
  { icon: "edit", name: "Editar", desc: "Cambia el nombre de la tarea." },
  { icon: "content_copy", name: "Duplicar", desc: "Crea una copia igual en el mismo grupo." },
  { icon: "delete", name: "Eliminar", desc: "La manda a la papelera (se puede recuperar)." },
  { icon: "swap_horiz", name: "Mover", desc: "La pasa a otro grupo que hayas creado." },
  { icon: "flag", name: "Prioridad", desc: "Marca Baja, Media, Alta o Muy importante." },
];

const TRASH_LEGEND = [
  { icon: "history", name: "Restaurar todo", desc: "Recupera todo lo archivado de una vez." },
  { icon: "delete_sweep", name: "Vaciar papelera", desc: "Borra TODO para siempre. No se puede deshacer." },
  { icon: "restore_from_trash", name: "♻️ por fila", desc: "Restaura solo ese grupo o tarea." },
  { icon: "delete_forever", name: "⚠️ por fila", desc: "Elimina ese elemento para siempre." },
  { icon: "done_all", name: "Restaurar todos/as", desc: "Restaura todo lo de esa sección (grupos o tareas)." },
];

const CONGRATS: Record<number, string> = {
  1: "¡Grupo creado! 🎉",
  2: "¡Ya ves tus grupos! 🎉",
  3: "¡Tareas creadas! 🎉",
  4: "¡Menú dominado! 🎉",
  5: "¡Papelera dominada! 🎉",
  6: "¡Tarea completada! 🎉",
  7: "¡Filtro usado! 🎉",
  8: "¡Planilla vista! 🎉",
};

const TutorialView = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [runId, setRunId] = useState(0);
  const [snapshot, setSnapshot] = useState<SandboxSnapshot>(EMPTY_SNAPSHOT);
  const [menuUsed, setMenuUsed] = useState(false);
  const [filterUsed, setFilterUsed] = useState(false);
  const [exportUsed, setExportUsed] = useState(false);
  const [celebration, setCelebration] = useState<string | null>(null);

  const target = STEP_TARGET[step] ?? null;

  // Snapshot estable: solo actualiza si cambian los conteos (evita loops)
  const handleSandboxChange = useCallback((s: SandboxSnapshot) => {
    setSnapshot((prev) =>
      prev.groupCount === s.groupCount &&
      prev.taskCount === s.taskCount &&
      prev.completedCount === s.completedCount &&
      prev.trashCount === s.trashCount
        ? prev
        : s
    );
  }, []);

  // Detecta interacciones reales (menú ⋮, filtro, exportar) por delegación de clicks
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('[data-tour="task-menu"]')) setMenuUsed(true);
      if (el.closest('[data-tour="filter"]') || el.closest('[data-tour="filter-panel"]'))
        setFilterUsed(true);
      if (el.closest('[data-tour="export-import"]')) setExportUsed(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Lleva el elemento del paso al centro de la pantalla (solo DOM, sin setState)
  useEffect(() => {
    if (!target) return;
    const el = document.querySelector(`[data-tour="${target}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [target, step, snapshot.groupCount, snapshot.taskCount]);

  const canContinue =
    step === 1
      ? snapshot.groupCount >= 1
      : step === 3
        ? snapshot.taskCount >= 1
        : step === 4
          ? menuUsed
          : step === 5
            ? snapshot.trashCount >= 1
            : step === 6
              ? snapshot.completedCount >= 1
              : step === 7
                ? filterUsed
                : step === 8
                  ? exportUsed
                  : true;

  const hint =
    step === 1 && snapshot.groupCount === 0
      ? "Escribe un nombre arriba y pulsa +."
      : step === 3
        ? `Llevas ${Math.min(snapshot.taskCount, 3)}/3 tareas sugeridas.`
        : step === 4 && !menuUsed
          ? "Toca ⋮ en una tarea para abrir el submenú en vivo."
          : step === 5 && snapshot.trashCount === 0
            ? "Tip: abre ⋮ en una tarea → Eliminar para llenar la papelera, luego ábrela."
            : step === 6 && snapshot.completedCount === 0
              ? "Marca el cuadradito de alguna tarea."
              : step === 7 && !filterUsed
                ? "Toca el embudo y elige una prioridad."
                : step === 8 && !exportUsed
                  ? "Pulsa «Exportar planilla» (aquí no descarga nada real)."
                  : null;

  const goNext = () => {
    const msg = CONGRATS[step];
    if (msg) {
      setCelebration(msg);
      window.setTimeout(() => setCelebration(null), 1200);
    }
    setStep((s) => Math.min(9, s + 1));
  };

  const handleReset = () => {
    setRunId((i) => i + 1);
    setSnapshot(EMPTY_SNAPSHOT);
    setMenuUsed(false);
    setFilterUsed(false);
    setExportUsed(false);
    setCelebration(null);
    setStep(1);
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-skin transition-all duration-500 overflow-x-hidden pb-40"
      data-active-tour={target ?? undefined}
    >
      {/* key={runId}: repetir el tutorial remonta el sandbox vacío */}
      <div key={runId}>
        <TutorialSandboxProviders>
          <div className="w-full max-w-app mx-auto px-3 sm:px-6 pt-3">
            <div className="flex items-center justify-between gap-2 rounded-2xl border-2 border-dashed border-amber-600 bg-amber-100/80 text-amber-900 px-3 py-1.5">
              <p className="text-xs sm:text-sm font-bold">
                💡 MODO TUTORIAL · es la app de verdad, pero nada se guarda
              </p>
              <button
                onClick={() => navigate("/")}
                className="shrink-0 bg-neutral-800 text-white text-xs sm:text-sm px-3 py-1.5 rounded-lg min-h-[44px]"
              >
                Volver a la app
              </button>
            </div>
          </div>

          <header>
            <Header />
          </header>
          <main className="grow w-full max-w-app mx-auto px-3 sm:px-6 lg:px-8">
            <section>
              <GroupManager sandbox onSandboxChange={handleSandboxChange} />
            </section>
          </main>
          <footer className="mt-auto w-full max-w-app mx-auto px-3 sm:px-6 pb-safe">
            <Footer />
          </footer>
        </TutorialSandboxProviders>
      </div>

      {/* Festejo al superar la fase */}
      {celebration && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[120] bg-green-600 text-white font-bold px-5 py-3 rounded-2xl shadow-2xl animate-celebrate whitespace-nowrap">
          {celebration}
        </div>
      )}

      {/* Bienvenida */}
      {step === 0 && (
        <div className="fixed inset-0 z-[115] bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-neutral-900 text-white shadow-2xl p-5 animate-fadeIn">
            <p className="font-bold text-lg">💡 {STEP_TEXT[0]}</p>
            <p className="text-xs opacity-70 mt-1">
              Practicarás en una copia idéntica: lo que crees o borres aquí no se guarda.
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-amber-500 text-black font-bold px-4 py-2 rounded-xl min-h-[44px]"
              >
                Dale
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-gray-600 px-4 py-2 rounded-xl min-h-[44px]"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coachmark */}
      {step > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-[110] p-3">
          <div className="w-full max-w-app mx-auto rounded-2xl bg-neutral-900 text-white shadow-2xl p-4 animate-slideIn">
            {step === 9 ? (
              <>
                <p className="font-bold">🎓 {STEP_TEXT[9]}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-amber-500 text-black font-bold px-4 py-2 rounded-xl min-h-[44px]"
                  >
                    Repetir tutorial
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="flex-1 bg-green-600 font-bold px-4 py-2 rounded-xl min-h-[44px]"
                  >
                    Volver a la app
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-xs opacity-70">
                  Paso {step}/8 · {STEP_TITLE[step]}
                </p>
                <p className="font-medium mt-1">{STEP_TEXT[step]}</p>
                {step === 4 && (
                  <ul className="mt-2 flex flex-col gap-1 text-sm bg-black/30 rounded-xl p-2">
                    {ACTION_LEGEND.map((a) => (
                      <li key={a.icon} className="flex gap-2 items-start">
                        <span className="material-symbols-outlined text-base mt-0.5">{a.icon}</span>
                        <span>
                          <b>{a.name}:</b> {a.desc}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {step === 5 && (
                  <ul className="mt-2 flex flex-col gap-1 text-sm bg-black/30 rounded-xl p-2">
                    <li className="font-bold text-amber-300 mb-1">🗑️ Guía de la papelera:</li>
                    {TRASH_LEGEND.map((a) => (
                      <li key={a.icon} className="flex gap-2 items-start">
                        <span className="material-symbols-outlined text-base mt-0.5">{a.icon}</span>
                        <span>
                          <b>{a.name}:</b> {a.desc}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {hint && <p className="text-xs opacity-70 mt-1">{hint}</p>}
                {!canContinue && step !== 2 && (
                  <p className="text-xs text-amber-300 mt-1">
                    ✓ Haz la acción en la app para poder continuar.
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                    className="px-4 py-2 rounded-xl bg-neutral-700 min-h-[44px]"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={goNext}
                    disabled={!canContinue}
                    className="flex-1 bg-amber-500 text-black font-bold px-4 py-2 rounded-xl min-h-[44px] disabled:opacity-40"
                  >
                    Continuar
                  </button>
                  <button
                    onClick={() => setStep((s) => Math.min(9, s + 1))}
                    className="px-3 py-2 text-xs underline opacity-70"
                  >
                    Saltar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorialView;
