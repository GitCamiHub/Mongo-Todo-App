import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { sprintStore } from "../../../store/sprintStore";

type Props = {
  onAssignSprint: (sprintId: string) => void;
};

const SprintDropdownButton: React.FC<Props> = ({ onAssignSprint }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sprints = sprintStore((state) => state.sprints);

  const handleSelect = (sprintId: string) => {
    onAssignSprint(sprintId);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#504136]/75 text-white px-3 py-1 rounded-full text-sm flex items-center"
      >
        Enviar a <ChevronDown size={16} className="ml-1" />
      </button>

      {isOpen && (
        <div className="absolute mt-2 right-0 w-48 bg-white border rounded-md shadow-lg z-10">
          <ul className="py-1 text-sm text-gray-700">
            {sprints.map((sprint) => (
              <li
                key={sprint.id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelect(sprint.id!)}
              >
                {sprint.nombre}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SprintDropdownButton;
