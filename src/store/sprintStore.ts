import { create } from "zustand";
import { ISprint } from "../types/ISprint";
import { ITarea } from "../types/ITarea";
import axios from "axios";
import { eliminarTareaPorId, postNuevaTarea } from "../http/tareas";

const API_URL = import.meta.env.VITE_API_URL;

interface ISprintStore {
  sprints: ISprint[];
  sprintActivo: ISprint | null;

  setSprintActivo: (sprintActivo: ISprint | null) => void;
  setArraySprints: (arrayDeSprints: ISprint[]) => void;
  agregarNuevoSprint: (nuevoSprint: ISprint) => void;
  editarUnSprint: (sprintActualizado: ISprint) => void;
  eliminarUnSprint: (idSprint: string) => void;
  asignarTareaASprint: (tarea: ITarea, sprintId: string) => Promise<void>;
  actualizarSprintActivo: (sprintActualizado: ISprint) => void;
  enviarTareaAlBacklog: (tarea: ITarea, stprintId: string) => void;
}

export const sprintStore = create<ISprintStore>((set, get) => ({
  sprints: [],
  sprintActivo: null,

  setSprintActivo: (sprintActivoIn) => set(() => ({ sprintActivo: sprintActivoIn })),

  setArraySprints: (arrayDeSprints) => set(() => ({ sprints: arrayDeSprints })),

  agregarNuevoSprint: (nuevoSprint) => set((state) => ({
    sprints: [...state.sprints, nuevoSprint]
  })),

  editarUnSprint: (sprintEditado) => set((state) => {
    const arregloSprints = state.sprints.map((sprint) =>
      sprint.id === sprintEditado.id ? { ...sprint, ...sprintEditado } : sprint
    );
    const sprintActivo = state.sprintActivo?.id === sprintEditado.id ? { ...state.sprintActivo, ...sprintEditado } : state.sprintActivo;
    return { sprints: arregloSprints, sprintActivo };
  }),

  eliminarUnSprint: (idSprint) => set((state) => {
    const arregloSprints = state.sprints.filter((sprint) =>
      sprint.id !== idSprint
    );
    const sprintActivo = state.sprintActivo?.id === idSprint ? null : state.sprintActivo;
    return { sprints: arregloSprints, sprintActivo };
  }),

  asignarTareaASprint: async (tarea, sprintId) => {
    try {
      const tareaConEstado = { ...tarea, estado: "porHacer" };
      
      await eliminarTareaPorId(tarea.id!);

      set((state) => {
        const sprintsActualizados = state.sprints.map((sprint) => {
          if (sprint.id === sprintId) {
            const tareasActualizadas = [...(sprint.tareas ?? []), tareaConEstado];
            
            // Obtener primero todos los sprints
            axios.get(`${API_URL}/sprintList`)
              .then(response => {
                const todosLosSprints = response.data.sprints || [];
                
                // Actualizar el sprint específico dentro del array
                const sprintsModificados = todosLosSprints.map(s => 
                  s.id === sprintId ? { ...s, tareas: tareasActualizadas } : s
                );
                
                // Actualizar toda la lista de sprints
                axios.put(`${API_URL}/sprintList`, { sprints: sprintsModificados })
                  .catch(error => console.error("Error al actualizar sprint:", error));
              })
              .catch(error => console.error("Error al obtener sprints:", error));
            
            return { ...sprint, tareas: tareasActualizadas };
          }
          return sprint;
        });
        
        return { sprints: sprintsActualizados };
      });
      
      // No retornamos valor para cumplir con Promise<void>
    } catch (error) {
      console.error("Error al asignar tarea a sprint:", error);
      // No retornamos valor para cumplir con Promise<void>
    }
  },
  
  enviarTareaAlBacklog: async (tarea, sprintId) => {
    const tareaSinEstado = { ...tarea, estado: null };
  
    const { sprints } = get(); 
  
    // Eliminar la tarea del sprint
  const sprintsActualizados = sprints.map((sprint) => {
    if (sprint.id === sprintId) {
      // Asegurarse de que sprint.tareas sea un array antes de filtrar
      const tareasActualizadas = Array.isArray(sprint.tareas) 
        ? sprint.tareas.filter((t) => t.id !== tarea.id) 
        : [];
      
      return { ...sprint, tareas: tareasActualizadas };
    }
    return sprint;
  });
  
  // Actualizar la lista completa de sprints en la API
  await axios.put(`${API_URL}/sprintList`, { sprints: sprintsActualizados });
  
  // Actualizar Zustand local
  set((state) => {
    const sprintActivoActualizado = state.sprintActivo?.id === sprintId
      ? {
          ...state.sprintActivo,
          tareas: Array.isArray(state.sprintActivo.tareas)
            ? state.sprintActivo.tareas.filter((t) => t.id !== tarea.id)
            : []
        }
      : state.sprintActivo;
  
    return { sprints: sprintsActualizados, sprintActivo: sprintActivoActualizado };
  });
    // Agregar la tarea al backlog
    await postNuevaTarea(tareaSinEstado);
  },
  

  actualizarSprintActivo: (sprintActualizado) => set((state) => {
    const arregloSprints = state.sprints.map((sprint) =>
      sprint.id === sprintActualizado.id ? sprintActualizado : sprint
    );
    return { sprints: arregloSprints, sprintActivo: sprintActualizado };
  })
}));
