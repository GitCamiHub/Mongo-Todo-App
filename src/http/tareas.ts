import axios from "axios";
import { ITarea } from "../types/ITarea";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllTareas = async () => {
  try {
    const res = await axios.get(`${API_URL}/backlog`);
    return res.data.tareas;
    // return res.data[0]?.tareas || [];
  } catch (error) {
    console.log(error);
  }
};


export const postNuevaTarea = async (nuevaTarea: ITarea) => {
  try {
    const resTarea = await axios.post(`${API_URL}/tareas`, nuevaTarea);
    const tareaCreada = resTarea.data;
    await axios.put(`${API_URL}/backlog/add-tareas/${tareaCreada._id}`);
    return true;
  } catch (error) {
    console.error("Error al postear nueva tarea:", error);
    return false;
  }
};

export const editarTarea = async (tareaActualizada: ITarea) => {
  try {
    await axios.put(`${API_URL}/tareas/${tareaActualizada._id}`, tareaActualizada);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};


/*export const eliminarTareaPorId = async (idTarea: string) => {
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
};*/

export const eliminarTareaPorId = async (idTarea: string) => {
  try {
    await axios.delete(`${API_URL}/tareas/${idTarea}`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

