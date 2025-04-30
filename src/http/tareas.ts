import axios from "axios";
import { ITarea } from "../types/ITarea";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllTareas = async () => {
  try {
    const res = await axios.get<{ tareas: ITarea[] }>(`${API_URL}/backlog`);
    return res.data.tareas;
  } catch (error) {
    console.log(error);
  }
};

export const postNuevaTarea = async (nuevaTarea: ITarea) => {
  try {

    const resBacklog = await axios.get(`${API_URL}/backlog`);
    
    const tareasActuales = resBacklog.data.tareas || [];

    const nuevasTareas = [...tareasActuales, nuevaTarea];
    await axios.put(`${API_URL}/backlog`, {
      tareas: nuevasTareas
    });
    
    return true;
  } catch (error) {
    console.error("Error al postear nueva tarea:", error);
    return false;
  }
};

export const editarTarea = async (tareaActualizada: ITarea) => {
  try {
    const res = await axios.get<{ tareas: ITarea[] }>(`${API_URL}/backlog`);
    const tareasActuales = res.data.tareas || [];

    const nuevasTareas = tareasActuales.map((tarea) =>
      tarea.id === tareaActualizada.id ? { ...tarea, ...tareaActualizada } : tarea
    );

    await axios.put(`${API_URL}/backlog`, { tareas: nuevasTareas });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const eliminarTareaPorId = async (idTarea: string) => {
  try {
    const res = await axios.get<{ tareas: ITarea[] }>(`${API_URL}/backlog`);
    const tareasActuales = res.data.tareas || [];

    const nuevasTareas = tareasActuales.filter((tarea) => tarea.id !== idTarea);

    await axios.put(`${API_URL}/backlog`, { tareas: nuevasTareas });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
