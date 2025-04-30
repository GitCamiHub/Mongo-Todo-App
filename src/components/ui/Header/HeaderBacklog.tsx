import { Link } from "react-router";




export const HeaderBacklog = () => {


  return (
    <div>
      
        <div className="flex justify-center items-center mb-6">
        <h1 className="text-4xl font-bold font-mono">BACKLOG</h1>
        <div className="flex-1 text-right">
          <Link
            to={`/sprints`}
            className="bg-gray-500 text-white px-4 py-2 rounded-full"
          >SPRINTS</Link>
        </div>
      </div>
    </div>
  )
}
