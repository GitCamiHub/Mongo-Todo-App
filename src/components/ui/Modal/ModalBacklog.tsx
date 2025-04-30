import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { tareaStore } from "../../../store/tareaStore";
import { ITarea } from "../../../types/ITarea";
import { useTareas } from "../../../hooks/useTareas";
import { sprintStore } from "../../../store/sprintStore";
import { useSprints } from "../../../hooks/useSprints";

type IModal = {
    handleCloseModal: VoidFunction;
}

const initialState: ITarea = {
    titulo: "",
    descripcion: "",
    fechaLimite: "",
    estado:null
}

export const ModalBacklog: FC<IModal> = ({ handleCloseModal }) => {
    const tareaActiva = tareaStore((state) => state.tareaActiva);

    const setTareaActiva = tareaStore((state) => state.setTareaActiva);

    const { crearTarea, putTareaEditar } = useTareas();

    const [formValues, setFormValues] = useState<ITarea>(initialState);

    const { editarTareaDeSprint } = useSprints();

    useEffect(() => {
        if (tareaActiva) {
            setFormValues(tareaActiva);
        } else {
            setFormValues(initialState);
        }
    }, [tareaActiva]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormValues((prev) => ({ ...prev, [`${name}`]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
    
        const generarId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    
        if (tareaActiva) {
            const sprintActivo = sprintStore.getState().sprintActivo;
            const perteneceASprint = sprintActivo?.tareas?.some(t => t.id === tareaActiva.id);
    
            if (perteneceASprint) {
                editarTareaDeSprint(formValues);
            } else {
                putTareaEditar(formValues); 
            }
        } else {
            crearTarea({ ...formValues, id: generarId() });
        }
    
        setTareaActiva(null);
        handleCloseModal();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          
            <form
                onSubmit={handleSubmit}
                className="bg-white w-[28rem] p-6 rounded-lg shadow-md border border-[#226f54]"
            >
                {/* Título del modal */}
                <h2 className="text-center text-[#226f54] text-lg font-bold mb-4">
                    {tareaActiva ? "Editar tarea" : "Crear tarea en Backlog"}
                </h2>

                {/* Inputs */}
                <div className="space-y-4">
                    <input
                        placeholder="Ingrese un título"
                        type="text"
                        required
                        onChange={handleChange}
                        value={formValues.titulo}
                        autoComplete="off"
                        name="titulo"
                        className="w-full p-2 border border-[#226f54] text-[#226f54] placeholder-[#226f54] rounded-md focus:outline-none focus:ring-2 focus:ring-[#226f54]"
                    />
                    <textarea
                        placeholder="Descripción"
                        required
                        onChange={handleChange}
                        value={formValues.descripcion}
                        autoComplete="off"
                        name="descripcion"
                        className="w-full p-2 border border-[#226f54] text-[#226f54] placeholder-[#226f54] rounded-md focus:outline-none focus:ring-2 focus:ring-[#226f54]"
                    />
                    <input
                        type="date"
                        required
                        onChange={handleChange}
                        value={formValues.fechaLimite}
                        autoComplete="off"
                        name="fechaLimite"
                        className="w-full p-2 border border-[#226f54] text-[#226f54] rounded-md focus:outline-none focus:ring-2 focus:ring-[#226f54]"
                    />
                </div>

                {/* Botones alineados a los extremos */}
                <div className="flex justify-between mt-4">
                    <button
                        type="button"
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                        onClick={handleCloseModal}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-[#226f54] text-white px-4 py-2 rounded-md hover:bg-[#1b5944] transition"
                    >
                        {tareaActiva ? "Editar tarea" : "Crear tarea"}
                    </button>
                </div>
            </form>
        </div>


    )
}