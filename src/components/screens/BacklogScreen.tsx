

import { HeaderBacklog } from '../ui/Header/HeaderBacklog';
import { ListTareasBacklog } from '../ui/ListTareas/ListTareasBacklog';
import { useBacklog } from '../../hooks/useBacklog';



const BacklogScreen: React.FC = () => {

  useBacklog();

  return (

    <div>
      <HeaderBacklog />
      <ListTareasBacklog />

    </div>

  );
};

export default BacklogScreen;