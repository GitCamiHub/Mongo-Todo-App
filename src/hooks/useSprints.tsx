import { useShallow } from "zustand/shallow";
import { sprintStore } from "../store/sprintStore";
import { editarSprint, eliminarSprintPorId, getAllSprints, postNuevoSprint } from "../http/sprints";
import { ISprint } from "../types/ISprint";
import Swal from "sweetalert2";
import { ITarea } from "../types/ITarea";

export const useSprints = () => {
  const {
    sprints,
    setArraySprints,
    agregarNuevoSprint,
    eliminarUnSprint,
    editarUnSprint,
    enviarTareaAlBacklog,
    setSprintActivo,
    actualizarSprintActivo
  } = sprintStore(
    useShallow((state) => ({
      sprints: state.sprints,
      setArraySprints: state.setArraySprints,
      agregarNuevoSprint: state.agregarNuevoSprint,
      eliminarUnSprint: state.eliminarUnSprint,
      editarUnSprint: state.editarUnSprint,
      enviarTareaAlBacklog: state.enviarTareaAlBacklog,
      setSprintActivo: state.setSprintActivo,
      actualizarSprintActivo: state.actualizarSprintActivo
    }))
  );

  const getSprints = async () => {
    const data = await getAllSprints();
    if (data) setArraySprints(data);
  };

  const crearSprint = async (nuevoSprint: ISprint) => {
    agregarNuevoSprint(nuevoSprint);
    try {
      await postNuevoSprint(nuevoSprint);
      Swal.fire("Éxito", "Sprint creado correctamente", "success");
    } catch (error) {
      eliminarUnSprint(nuevoSprint.id!);
      console.log("Algo salió mal al crear el sprint");
    }
  };

  const editarTareaDeSprint = async (tareaEditada: ITarea) => {
    const { sprintActivo } = sprintStore.getState();
    if (!sprintActivo) {
      console.warn("No hay sprint activo");
      return;
    }

    const tareasActualizadas = sprintActivo.tareas?.map((t) =>
      t.id === tareaEditada.id ? { ...t, ...tareaEditada } : t
    ) || [];

    const sprintActualizado = { ...sprintActivo, tareas: tareasActualizadas };
    actualizarSprintActivo(sprintActualizado);

    try {
      await putSprintEditar(sprintActualizado);
    //  Swal.fire("Éxito", "Tarea del sprint actualizada", "success");
    } catch (error) {
      console.error("Error al actualizar la tarea del sprint");
    }
  };

  const putSprintEditar = async (sprintEditado: ISprint) => {
    const estadoPrevio = sprints.find((el) => el.id === sprintEditado.id);
    editarUnSprint(sprintEditado);

    try {
      await editarSprint(sprintEditado);
    //  Swal.fire("Éxito", "Sprint actualizado correctamente", "success");
    } catch (error) {
      if (estadoPrevio) editarUnSprint(estadoPrevio);
      console.log("Algo salió mal al editar el sprint");
    }
  };

  const eliminarSprint = async (idSprint: string) => {
    const estadoPrevio = sprints.find((el) => el.id === idSprint);

    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    eliminarUnSprint(idSprint);

    try {
      await eliminarSprintPorId(idSprint);
      Swal.fire("Eliminando", "Sprint eliminado correctamente", "success");
    } catch (error) {
      if (estadoPrevio) agregarNuevoSprint(estadoPrevio);
      console.log("Algo salió mal al eliminar el sprint");
    }
  };

  const verSprint = (sprintId: string) => {
    const { sprints } = sprintStore.getState();

    const sprint = sprints.find((s) => s.id === sprintId);

    if (!sprint) {
      Swal.fire({
        title: "Error",
        text: "No se encontró el sprint",
        icon: "error",
        confirmButtonColor: "#226f54",
      });
      return;
    }

    const tareasHtml = sprint.tareas && sprint.tareas.length > 0
      ? sprint.tareas.map(t => `
        <li class="mb-2">
          <span class="font-semibold text-[#226f54]">${t.titulo}</span>
          <span class="ml-2 px-2 py-0.5 text-sm rounded bg-gray-200 text-gray-800">${t.estado ?? "sin estado"}</span>
        </li>
      `).join("")
      : "<li>No hay tareas en este sprint</li>";

    Swal.fire({
      title: `<h2 class="text-center text-[#226f54] text-lg font-bold mb-2">${sprint.nombre}</h2>`,
      html: `
        <div class="text-left space-y-2">
          <p><strong>Inicio:</strong> ${sprint.fechaInicio}</p>
          <p><strong>Fin:</strong> ${sprint.fechaFin}</p>
          <div>
            <p class="font-semibold text-[#226f54] mt-4">Tareas:</p>
            <ul class="list-disc pl-5 mt-2">${tareasHtml}</ul>
          </div>
        </div>
      `,
      confirmButtonText: "Cerrar",
      confirmButtonColor: "#226f54",
      customClass: {
        popup: 'rounded-lg shadow-md border border-[#226f54] w-[32rem]',
        confirmButton: 'bg-[#226f54] text-white px-4 py-2 rounded-md hover:bg-[#1b5944] transition',
        title: 'text-[#226f54]',
      },
      buttonsStyling: false
    });
  };

  const verTareaDeSprint = (idTarea: string) => {
    const sprintActivo = sprintStore.getState().sprintActivo;

    const tarea = sprintActivo?.tareas?.find((t) => t.id === idTarea);

    if (!tarea) {
      Swal.fire({
        title: "Error",
        text: "No se encontró la tarea dentro del sprint",
        icon: "error",
        confirmButtonColor: "#226f54",
      });
      return;
    }

    const fechaLimite = new Date(tarea.fechaLimite);
    const hoy = new Date();
    fechaLimite.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);

    const diferencia = fechaLimite.getTime() - hoy.getTime();
    const diasRestantes = Math.ceil(diferencia / (1000 * 3600 * 24));

    let mensajeDias = "";
    if (diasRestantes < 0) {
      mensajeDias = `<span class="text-red-500 font-semibold">Vencida por ${Math.abs(diasRestantes)} día(s)</span>`;
    } else if (diasRestantes === 0) {
      mensajeDias = `<span class="text-orange-500 font-semibold">Vence hoy</span>`;
    } else {
      mensajeDias = `<span class="text-green-700 font-semibold">Faltan ${diasRestantes} día(s)</span>`;
    }

    Swal.fire({
      title: '<h2 class="text-center text-[#226f54] text-lg font-bold mb-4">Tarea del Sprint</h2>',
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
      confirmButtonText: "Cerrar",
      confirmButtonColor: "#226f54",
      customClass: {
        popup: 'rounded-lg shadow-md border border-[#226f54] w-[28rem]',
        confirmButton: 'bg-[#226f54] text-white px-4 py-2 rounded-md hover:bg-[#1b5944] transition',
        title: 'text-[#226f54]',
      },
      buttonsStyling: false
    });
  };

  return {
    getSprints,
    crearSprint,
    putSprintEditar,
    eliminarSprint,
    editarTareaDeSprint,
    enviarTareaAlBacklog,
    verSprint,
    verTareaDeSprint
  };
};
