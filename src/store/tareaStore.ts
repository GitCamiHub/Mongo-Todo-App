import { create } from "zustand";
import { ITarea } from "../types/ITarea";

interface ITareaStore {
  backlog: { tareas: ITarea[] };
  tareaActiva: ITarea | null;

  setTareaActiva: (tareaActiva: ITarea | null) => void;
  setArrayTareas: (arrayDeTareas: ITarea[]) => void;
  agregarNuevaTarea: (nuevaTarea: ITarea) => void;
  editarUnaTarea: (tareaActualizada: ITarea) => void;
  eliminarUnaTarea: (idTarea: string) => void;
}

export const tareaStore = create<ITareaStore>((set) => ({
  backlog: { tareas: [] },
  tareaActiva: null,

  setArrayTareas: (arrayDeTareas) =>
    set(() => ({ backlog: { tareas: arrayDeTareas } })),

  agregarNuevaTarea: (nuevaTarea) =>
    set((state) => ({
      backlog: { tareas: [...state.backlog.tareas, nuevaTarea] },
    })),

  editarUnaTarea: (tareaActualizada) =>
    set((state) => ({
      backlog: {
        tareas: state.backlog.tareas.map((tarea) =>
          tarea.id === tareaActualizada.id ? { ...tarea, ...tareaActualizada } : tarea
        ),
      },
    })),

  eliminarUnaTarea: (idTarea) =>
    set((state) => ({
      backlog: {
        tareas: state.backlog.tareas.filter((tarea) => tarea.id !== idTarea),
      },
    })),

  setTareaActiva: (tareaActivaIn) =>
    set(() => ({ tareaActiva: tareaActivaIn })),
}));
