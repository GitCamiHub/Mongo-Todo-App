import { useEffect } from 'react';
import axios from 'axios';
import { tareaStore } from '../store/tareaStore';

const API_URL = import.meta.env.VITE_API_URL;

export const useBacklog = () => {
  const setArrayTareas = tareaStore((state) => state.setArrayTareas);

  const fetchBacklog = async () => {
    try {
      const response = await axios.get(`${API_URL}/backlog`);
      
      if (response.data && response.data.length === 0) {
        await axios.post(`${API_URL}/backlog`);
        console.log("Backlog creado");
      }

      const backlog = response.data;
      setArrayTareas(backlog[0]?.tareas || []);
    } catch (error) {
      console.error("Error al cargar el backlog", error);
    }
  };

  useEffect(() => {
    fetchBacklog();
  }, []);
};