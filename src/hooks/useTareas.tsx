import { useShallow } from "zustand/shallow";
import { tareaStore } from "../store/tareaStore";
import { editarTarea, eliminarTareaPorId, getAllTareas, postNuevaTarea } from "../http/tareas";
import { ITarea } from "../types/ITarea";
import Swal from "sweetalert2";
import { useSprints } from "./useSprints";
import { sprintStore } from "../store/sprintStore";

export const useTareas = () => {
  const {
    backlog,
    setArrayTareas,
    agregarNuevaTarea,
    eliminarUnaTarea,
    editarUnaTarea,
  } = tareaStore(
    useShallow((state) => ({
      backlog: state.backlog,
      setArrayTareas: state.setArrayTareas,
      agregarNuevaTarea: state.agregarNuevaTarea,
      eliminarUnaTarea: state.eliminarUnaTarea,
      editarUnaTarea: state.editarUnaTarea,
    }))
  );

  const tareas = backlog.tareas;

  const { editarTareaDeSprint, putSprintEditar } = useSprints();

  const getTareas = async () => {
    const data = await getAllTareas();
    if (data) setArrayTareas(data);
  };

  const crearTarea = async (nuevaTarea: ITarea) => {
    agregarNuevaTarea(nuevaTarea);
    try {
      await postNuevaTarea(nuevaTarea);
      Swal.fire("Éxito", "Tarea creada correctamente", "success");
    } catch (error) {
      eliminarUnaTarea(nuevaTarea.id!);
      console.log("Algo salió mal al crear la tarea");
    }
  };

  const putTareaEditar = async (tareaEditada: ITarea) => {
    const estadoPrevio = tareas.find((el) => el.id === tareaEditada.id);
    editarUnaTarea(tareaEditada);

    console.log("Tareas antes de la actualización:", tareas);

    try {
      await editarTarea(tareaEditada);

    } catch (error) {
      if (estadoPrevio) editarUnaTarea(estadoPrevio);
      console.log("Algo salió mal al editar");
    }
  };

  const eliminarTarea = async (idTarea: string) => {
    const { sprintActivo, setSprintActivo } = sprintStore.getState();
    const perteneceASprint = sprintActivo?.tareas?.some((t) => t.id === idTarea);

    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: perteneceASprint
        ? "Esta tarea será eliminada del sprint activo"
        : "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    if (perteneceASprint && sprintActivo) {
      const tareasActualizadas = sprintActivo.tareas?.filter((t) => t.id !== idTarea) || [];
      const sprintActualizado = { ...sprintActivo, tareas: tareasActualizadas };

      try {
        await putSprintEditar(sprintActualizado);
        setSprintActivo(sprintActualizado);
        Swal.fire("Eliminado", "Tarea eliminada del sprint correctamente", "success");
      } catch (error) {
        console.log("Error al eliminar tarea del sprint");
        Swal.fire("Error", "No se pudo eliminar la tarea del sprint", "error");
      }
    } else {
      const estadoPrevio = tareas.find((el) => el.id === idTarea);
      eliminarUnaTarea(idTarea);

      try {
        await eliminarTareaPorId(idTarea);
        Swal.fire("Eliminado", "Tarea eliminada correctamente", "success");
      } catch (error) {
        if (estadoPrevio) agregarNuevaTarea(estadoPrevio);
        console.log("Algo salió mal al eliminar del backlog");
      }
    }
  };

  const verTarea = (idTarea: string) => {
    const tarea = tareas.find((tarea) => tarea.id === idTarea);

    if (!tarea) {
      Swal.fire({
        title: "Error",
        text: "No se encontró la tarea",
        icon: "error",
        confirmButtonColor: "#226f54",
        customClass: {
          popup: 'rounded-lg shadow-md border border-[#226f54]',
          confirmButton: 'bg-[#226f54] text-white px-4 py-2 rounded-md hover:bg-[#1b5944] transition',
        },
        buttonsStyling: false
      });
      return;
    }

    const fechaLimite = new Date(tarea.fechaLimite);
    const hoy = new Date();

    fechaLimite.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);

    const diferenciaTiempo = fechaLimite.getTime() - hoy.getTime();
    const diasRestantes = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));

    let mensajeDias = "";

    if (diasRestantes < 0) {
      mensajeDias = `<span class="text-red-500 font-semibold">La tarea está vencida por ${Math.abs(diasRestantes)} día(s)</span>`;
    } else if (diasRestantes === 0) {
      mensajeDias = `<span class="text-orange-500 font-semibold">La tarea vence hoy</span>`;
    } else {
      mensajeDias = `<span class="text-[#504136] font-semibold">Faltan ${diasRestantes} día(s)</span>`;
    }

    Swal.fire({
      title: '<h2 class="text-center text-[#226f54] text-lg font-bold mb-4">Detalles de la tarea</h2>',
      html: `
        <div class="space-y-4">
          <div>
            <label class="block font-semibold text-[#226f54]">Título</label>
            <p class="w-full p-2 border border-[#226f54] text-[#226f54] rounded-md">${tarea.titulo}</p>
          </div>
          <div>
            <label class="block font-semibold text-[#226f54]">Descripción</label>
            <p class="w-full p-2 border border-[#226f54] text-[#226f54] rounded-md">${tarea.descripcion}</p>
          </div>
          <div>
            <label class="block font-semibold text-[#226f54]">Fecha límite</label>
            <p class="w-full p-2 border border-[#226f54] text-[#226f54] rounded-md">${tarea.fechaLimite}</p>
            <p class="w-full p-2 text-[#226f54] rounded-md">${mensajeDias}</p>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Cerrar",
      cancelButtonText: "Volver",
      confirmButtonColor: "#226f54",
      customClass: {
        popup: 'rounded-lg shadow-md border border-[#226f54] w-[28rem]',
        confirmButton: 'bg-[#226f54] text-white px-4 py-2 rounded-md hover:bg-[#1b5944] transition',
        cancelButton: 'bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition',
        actions: 'flex justify-between mt-4',
        title: 'text-[#226f54]',
      },
      buttonsStyling: false
    });
  };

  const cambiarEstado = async (tarea: ITarea) => {
    const nuevoEstado =
      tarea.estado === "porHacer" ? "enProceso" :
      tarea.estado === "enProceso" ? "completado" :
      null;

    if (!nuevoEstado) return;

    const tareaEditada = { ...tarea, estado: nuevoEstado };

    const sprintActivo = sprintStore.getState().sprintActivo;
    const perteneceASprint = sprintActivo?.tareas?.some(t => t.id === tarea.id);

    if (perteneceASprint) {
      await editarTareaDeSprint(tareaEditada);
    } else {
      await putTareaEditar(tareaEditada);
    }
  };

  return {
    getTareas,
    crearTarea,
    putTareaEditar,
    eliminarTarea,
    verTarea,
    tareas,
    cambiarEstado,
  };
};
