import { FC } from "react";
import { ISprint } from "../../../types/ISprint";
import {  Edit, Eye, Trash2 } from "lucide-react";
import { useSprints } from "../../../hooks/useSprints";
import { sprintStore } from "../../../store/sprintStore";
import { Link } from "react-router-dom";

type ICardListSprint = {
  sprint: ISprint;
  handleOpenModalEdit: (sprint: ISprint) => void;
  handleOpenModal: (sprint: ISprint) => void;
};

export const CardListSprint: FC<ICardListSprint> = ({
  sprint,
  handleOpenModalEdit,
  handleOpenModal
}) => {
  const { eliminarSprint, verSprint} = useSprints();

  const eliminarSprintPorId = () => {
    eliminarSprint(sprint.id!);
  };
  const editarSprint = () => {
    handleOpenModalEdit(sprint);
  };

  const verDetalleSprint = () => {
    verSprint(sprint.id!);
  };
  const sprintActivo = () => {
    handleOpenModal(sprint);
  }

  
   return (

       <div>
         <div className="bg-white/70 rounded-2xl shadow-md mb-5 p-3 flex flex-col">
             <div>
             <h3 className="font-semibold text-center hover:font-bold transition-all duration-200 cursor-pointer" onClick={sprintActivo}>{sprint.nombre}</h3>
             
            </div> 
             
             <div className="flex mt-2">
               <p className="text-sm text-[#504136] "> {sprint.fechaInicio}</p>
               <p className="text-sm text-[#504136] ml-2"> {sprint.fechaFin}</p>
               <div className="flex items-center space-x-1 ml-4">
                 <Eye className="text-gray-500 cursor-pointer hover:text-blue-500" size={20} onClick={verDetalleSprint}/>
                 <Edit className="text-gray-500 cursor-pointer hover:text-yellow-500" size={20} onClick={editarSprint}/>
                 <Trash2 className="text-gray-500 cursor-pointer hover:text-red-500" size={20} onClick={eliminarSprintPorId} />
               </div>
             </div>
   
           </div>
       </div>
  
     );
   };
   