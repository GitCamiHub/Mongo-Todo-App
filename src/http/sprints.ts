import axios from "axios";
import { ISprint } from "../types/ISprint";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllSprints = async () => {
  try {
    const res = await axios.get<{ sprints: ISprint[] }>(`${API_URL}/sprintList`);
    return res.data.sprints;
  } catch (error) {
    console.log(error);
  }
};

export const postNuevoSprint = async (nuevoSprint: ISprint) => {
  try {
    const res = await axios.get(`${API_URL}/sprintList`);
    const sprintsActuales = res.data.sprints || [];

    const nuevosSprints = [...sprintsActuales, nuevoSprint];
    await axios.put(`${API_URL}/sprintList`, { sprints: nuevosSprints });
  } catch (error) {
    console.log(error);
  }
};

export const editarSprint = async (sprintActualizado: ISprint) => {
  try {
    const res = await axios.get<{ sprints: ISprint[] }>(`${API_URL}/sprintList`);
    const sprintsActuales = res.data.sprints || [];

    const nuevosSprints = sprintsActuales.map((sprint) =>
      sprint.id === sprintActualizado.id ? { ...sprint, ...sprintActualizado } : sprint
    );

    await axios.put(`${API_URL}/sprintList`, { sprints: nuevosSprints });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const eliminarSprintPorId = async (idSprint: string) => {
  try {
    const res = await axios.get<{ sprints: ISprint[] }>(`${API_URL}/sprintList`);
    const sprintsActuales = res.data.sprints || [];

    const nuevosSprints = sprintsActuales.filter((sprint) => sprint.id !== idSprint);

    await axios.put(`${API_URL}/sprintList`, { sprints: nuevosSprints });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
