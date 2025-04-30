import { FC } from "react";
import { ITarea } from "../../../types/ITarea";
import { Edit, Eye, Trash2, MoveRight } from "lucide-react";
import { useTareas } from "../../../hooks/useTareas";
import { sprintStore } from "../../../store/sprintStore";
import EnviarABacklogButton from "../Dropdown/EnviarABacklogButton";
import { useSprints } from "../../../hooks/useSprints";

type ICardList = {
  tarea: ITarea;
  handleOpenModalEdit: (tarea: ITarea) => void;
};

export const CardListEstado: FC<ICardList> = ({
  tarea,
  handleOpenModalEdit,
}) => {
  const { eliminarTarea, cambiarEstado } = useTareas();

  const sprintActivo = sprintStore((state) => state.sprintActivo);

  const eliminarTareaById = () => {
    eliminarTarea(tarea.id!);
  };

  const editarTarea = () => {
    handleOpenModalEdit(tarea);
  };

  const { verTareaDeSprint } = useSprints();

  const verDetalleTareaSprint = () => {
    verTareaDeSprint(tarea.id!);
  };

  return (
    <div className="bg-white/75 rounded-xl shadow-md mb-3 p-4 flex flex-wrap md:flex-nowrap">
      <div className="w-full  h-full">
        <div className="flex items-center">
          <div className="flex-1 text-center">
            <h3 className="font-semibold line-clamp-1">{tarea.titulo}</h3>
          </div>

          <MoveRight
            className="cursor-pointer text-gray-500 hover:text-black ml-2"
            size={25}
            onClick={(e) => {
              cambiarEstado(tarea);
            }}
          />
        </div>

        <div className="flex-grow">
          <p className="text-sm text-gray-500 line-clamp-1">
            {tarea.descripcion}
          </p>
        </div>

        <div className="flex justify-between items-center mt-1">
          <span className="text-sm">{tarea.fechaLimite}</span>

          {sprintActivo && (
            <EnviarABacklogButton tarea={tarea} sprintId={sprintActivo.id!} />
          )}

          <div className="flex space-x-2">
            <Eye
              className="text-gray-500 cursor-pointer hover:text-blue-500"
              size={20}
              onClick={(e) => {
                e.stopPropagation();
                verDetalleTareaSprint();
              }}
            />
            <Edit
              className="text-gray-500 cursor-pointer hover:text-yellow-500"
              size={20}
              onClick={editarTarea}
            />
            <Trash2
              className="text-gray-500 cursor-pointer hover:text-red-500"
              size={20}
              onClick={eliminarTareaById}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
