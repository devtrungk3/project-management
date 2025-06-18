import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import RouteHandler from './components/RouteHandler'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<RouteHandler />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
