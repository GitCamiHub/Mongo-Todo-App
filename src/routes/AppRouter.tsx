
import {  Navigate, Route, Routes } from "react-router"
import BacklogScreen from "../components/screens/BacklogScreen"
import SprintScreen from "../components/screens/SprintScreen"


export const AppRouter: React.FC = () => {

  return (
    <Routes>
        <Route path="/" element={<Navigate to="/sprints" />} />
        <Route path='/tareas' element={<BacklogScreen />} />
        <Route path='/sprints' element={<SprintScreen />} />
        <Route path='/sprints/:id' element={<SprintScreen />} />
      </Routes>

  )
}
