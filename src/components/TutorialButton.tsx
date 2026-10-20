import { useNavigate } from "react-router-dom";

const TutorialButton = () => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate("/tutorial")}
      title="Abrir tutorial interactivo"
      aria-label="Abrir tutorial interactivo"
      className="touch-44 flex items-center justify-center material-symbols-outlined text-3xl sm:text-4xl leading-none hover:bg-amber-300 p-2 sm:p-3 rounded-3xl transition-colors"
    >
      lightbulb
    </button>
  );
};

export default TutorialButton;
