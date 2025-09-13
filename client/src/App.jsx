import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import './App.css'
import RouteHandler from './pages/RouteHandler'
const router = createBrowserRouter([
  {
    path: "/*",
    element: <RouteHandler />,
  }
]);
function App() {
  return (
    <RouterProvider router={router}/>
  )
}

export default App
