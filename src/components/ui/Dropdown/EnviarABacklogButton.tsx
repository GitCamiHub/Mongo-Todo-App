import React from "react";

import { ITarea } from "../../../types/ITarea";
import { useSprints } from "../../../hooks/useSprints";


interface Props {
  tarea: ITarea;
  sprintId: string;
}

const EnviarABacklogButton: React.FC<Props> = ({ tarea, sprintId }) => {
  const { enviarTareaAlBacklog } = useSprints();

  const handleClick = async () => {
    try {
      await enviarTareaAlBacklog(tarea, sprintId);
      console.log("Tarea enviada al backlog exitosamente");
    } catch (error) {
      console.error("Error al enviar la tarea al backlog:", error);
    }
  };

  return (
    <button 
    onClick={handleClick} 
    className="bg-[#504136]/75 text-white px-3 py-1 rounded-full text-sm flex items-center hover:bg-[#504136]/90 transition duration-200 cursor-pointer"
    >
      BL
    </button>
  );
};

export default EnviarABacklogButton;
