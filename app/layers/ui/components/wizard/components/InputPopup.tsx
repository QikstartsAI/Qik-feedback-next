import { useEffect, useRef } from "react";

interface InputPopupProps {
  show: boolean;
  onClose: () => void;
  onChange: (fieldId: string, value: any) => void;
}

export const InputPopup: React.FC<InputPopupProps> = ({
  show,
  onClose,
  onChange,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        ref={popupRef}
        className="!text-center bg-white p-6 rounded-xl border border-black border-opacity-60 shadow-lg max-w-md w-full"
      >
        <h2 className="text-blue-500 text-2xl font-bold mb-4">
          ¿Decribe la razón de visitarnos?
        </h2>
        <textarea
          className="w-full border-2 border-blue-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Ej: En una reunión de amigos"
          rows={3}
        />
        <button
          className="mt-4 px-5 py-2 hover:bg-blue-800 focus:ring focus:ring-blue-200 bg-blue-600 text-white rounded-full"
          onClick={onClose}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};
