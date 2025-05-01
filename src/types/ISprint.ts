import { ITarea } from "./ITarea"

export interface ISprint {
  _id: string
  nombre: string
  fechaInicio: string
  fechaFin: string
  tareas?: ITarea[]

}
