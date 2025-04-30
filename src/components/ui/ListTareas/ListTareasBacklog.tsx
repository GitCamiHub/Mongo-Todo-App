import { useEffect, useState } from "react";
import { getAllTareas } from "../../../http/tareas";
import { tareaStore } from "../../../store/tareaStore";
import { CardListBacklog } from "../CardList/CardListBacklog";
import { ModalBacklog } from "../Modal/ModalBacklog";
import { ITarea } from "../../../types/ITarea";


export const ListTareasBacklog = () => {

    const backlog = tareaStore((state) => state.backlog);
    const tareas = backlog.tareas;


    const setTareaActiva = tareaStore((state) => state.setTareaActiva);

    const setArrayTareas = tareaStore((state) => state.setArrayTareas);

    const getTareas = async () => {
        const data = await getAllTareas();
        if (data) setArrayTareas(data);
    };

    useEffect(() => {
        getTareas();
    }, []);

    const [openModalTarea, setOpenModalTarea] = useState(false);


    const handleOpenModalEdit = (tarea: ITarea) => {
        setTareaActiva(tarea);
        setOpenModalTarea(true);
    };



    const handleCloseModal = () => {
        setTareaActiva(null);
        setOpenModalTarea(false);
        
    };

    return (
        <>

            <div className=" bg-[#87c38f]/70 rounded-2xl p-4 mi-h-screen h-full dark:bg-black">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Tareas en el backlog</h2>
                    <button className="bg-[#504136] text-white px-4 py-2 rounded-full"
                        onClick={() => {setOpenModalTarea(true);}}>
                        Crear tarea
                        <span className="ml-2">+ </span>
                        </button>
                </div>

                <div className=" bg-[#87c38f]/70 rounded-2xl p-4 mi-h-screen h-full">

                {tareas.filter((el) => el.estado === null).length > 0 ? (
      tareas
        .filter((el) => el.estado === null)
        .map((el) => (
          <CardListBacklog
            key={el.id}
            handleOpenModalEdit={handleOpenModalEdit}
            tarea={el}
          />
        ))
    ) : (
      <div>
        <h3>No hay tareas en el backlog</h3>
      </div>
    )}

                </div>
            </div>
            {openModalTarea && <ModalBacklog handleCloseModal={handleCloseModal} />}
        </>
    )
}
