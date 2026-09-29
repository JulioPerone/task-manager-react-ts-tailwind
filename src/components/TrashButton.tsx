// Botón con icono de papelera. Ubicación: en Header.tsx, debajo de <DarkLightTheme />.

type TrashButtonProps = {
  count?: number;
  onClick?: () => void;
  title?: string;
};

const TrashButton = ({ count = 0, onClick, title = "Abrir papelera" }: TrashButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className="relative material-symbols-outlined text-7xl hover:bg-red-400 p-3 rounded-3xl transition-colors"
    >
      delete
      {count > 0 && (
        <span
          aria-hidden
          className="absolute top-1 right-1 bg-red-600 text-white text-xs font-bold rounded-full min-w-6 h-6 flex items-center justify-center px-1"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
};

export default TrashButton;
