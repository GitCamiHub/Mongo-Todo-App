import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { sprintStore } from "../../../store/sprintStore";
import { ISprint } from "../../../types/ISprint";
import { useSprints } from "../../../hooks/useSprints";

type IModal = {
    handleCloseModal: VoidFunction;
};

const initialState: ISprint = {
    nombre: "",
    fechaInicio: "",
    fechaFin: "",
    tareas: [],
};

export const ModalSprint: FC<IModal> = ({ handleCloseModal }) => {
    const sprintActivo = sprintStore((state) => state.sprintActivo);
    const setSprintActivo = sprintStore((state) => state.setSprintActivo);
    const { crearSprint, putSprintEditar } = useSprints();

    const [formValues, setFormValues] = useState<ISprint>(initialState);

    useEffect(() => {
        if (sprintActivo) {
            setFormValues(sprintActivo);
        } else {
            setFormValues(initialState);
        }
    }, [sprintActivo]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const generarId = (sprints: ISprint[]): number => {
        const ids = sprints.map((s) => Number(s.id));
        const maxId = ids.length > 0 ? Math.max(...ids) : 0;
        return maxId + 1;
    };

    const sprints = sprintStore.getState().sprints; 

    if (sprintActivo) {
        putSprintEditar(formValues);
    } else {
        crearSprint({ ...formValues, id: generarId(sprints).toString() });
    }

    setSprintActivo(null);
    handleCloseModal();
};

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <form
                onSubmit={handleSubmit}
                className="bg-white w-[28rem] p-6 rounded-lg shadow-md border border-[#226f54]"
            >
                <h2 className="text-center text-[#226f54] text-lg font-bold mb-4">
                    {sprintActivo ? "Editar sprint" : "Crear nuevo sprint"}
                </h2>

                <div className="space-y-4">
                    <input
                        placeholder="Nombre del sprint"
                        type="text"
                        required
                        name="nombre"
                        value={formValues.nombre}
                        onChange={handleChange}
                        autoComplete="off"
                        className="w-full p-2 border border-[#226f54] text-[#226f54] placeholder-[#226f54] rounded-md focus:outline-none focus:ring-2 focus:ring-[#226f54]"
                    />
                    <input
                        type="date"
                        name="fechaInicio"
                        value={formValues.fechaInicio}
                        required
                        onChange={handleChange}
                        className="w-full p-2 border border-[#226f54] text-[#226f54] rounded-md focus:outline-none focus:ring-2 focus:ring-[#226f54]"
                    />
                    <input
                        type="date"
                        name="fechaFin"
                        value={formValues.fechaFin}
                        required
                        onChange={handleChange}
                        className="w-full p-2 border border-[#226f54] text-[#226f54] rounded-md focus:outline-none focus:ring-2 focus:ring-[#226f54]"
                    />
                </div>

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
                        {sprintActivo ? "Editar sprint" : "Crear sprint"}
                    </button>
                </div>
            </form>
        </div>
    );
};