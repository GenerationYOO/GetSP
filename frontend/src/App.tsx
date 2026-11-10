import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Register } from "./pages/Register/Register";
import { Login } from "./pages/Login/Login";
import { DevKit } from "./pages/DevKit/DevKit";
import { SessionCreation } from "./pages/CreateSession/CreateSession";
import './App.css'

function App() {

  return (
    <BrowserRouter basename="">
     <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/devkit" element={<DevKit />} />
        <Route path="/create-session" element={<SessionCreation />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
