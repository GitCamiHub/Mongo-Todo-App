import axios from "axios";
import { ISprint } from "../types/ISprint";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllSprints = async () => {
  try {
    const res = await axios.get(`${API_URL}/sprints`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener sprints:", error);
    return [];
  }
};


export const postNuevoSprint = async (nuevoSprint: ISprint) => {
  try {
    const res = await axios.post(`${API_URL}/sprints`, nuevoSprint);
    return res.data.sprint; // o res.data.sprint si así responde el backend
  } catch (error) {
    console.error("Error al crear el sprint:", error);
  }
};



export const editarSprint = async (sprintActualizado: ISprint) => {
  try {
    await axios.put(`${API_URL}/sprints/${sprintActualizado._id}`, sprintActualizado);
    return true;
  } catch (error) {
    console.error("Error al editar sprint:", error);
    return false;
  }
};

export const eliminarSprintPorId = async (idSprint: string) => {
  try {
    await axios.delete(`${API_URL}/sprints/${idSprint}`);
    return true;
  } catch (error) {
    console.error("Error al eliminar sprint:", error);
    return false;
  }
};

