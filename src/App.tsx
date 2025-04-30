import { BrowserRouter } from "react-router";
import SprintList from "./components/ui/ListSprints/ListSprints";
import { AppRouter } from "./routes/AppRouter";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-100">
        <div className="w-1/4 bg-[#226f54] p-4 border-r ">
          <div className="bg-[#87c38f] rounded-2xl p-4 mi-h-screen h-full">
            <SprintList />
          </div>
        </div>
        <div className="w-3/4 p-6">
          <AppRouter />
        </div>
        
      </div>
    </BrowserRouter>
  );
}

export default App;

/* */
