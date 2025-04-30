import { useEffect } from 'react';
import { useParams } from 'react-router';
import { sprintStore } from '../../store/sprintStore';
import { HeaderSprint } from '../ui/Header/HeaderSprint';
import { ListEstado } from '../ui/ListSprints/ListEstado';

const SprintScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const sprints = sprintStore((state) => state.sprints);
  const sprintActivo = sprintStore((state) => state.sprintActivo);
  const setSprintActivo = sprintStore((state) => state.setSprintActivo);

  useEffect(() => {
    if (id && !sprintActivo) {
      const sprintEncontrado = sprints.find((sprint) => sprint.id === id);
      if (sprintEncontrado) {
        setSprintActivo(sprintEncontrado);
      }
    }
  }, [id, sprints, sprintActivo, setSprintActivo]);

  return (
    <div className="flex flex-col p-6">
      <HeaderSprint
        title={sprintActivo?.nombre || 'Sprint'}
        subTitle={sprintActivo?.fechaFin || 'Fecha límite'}
      />

      <div className="flex space-x-4">
        <ListEstado />
      </div>
    </div>
  );
};

export default SprintScreen;

