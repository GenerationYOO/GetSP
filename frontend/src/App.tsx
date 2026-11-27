import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Register } from "./pages/Register/Register";
import { Login } from "./pages/Login/Login";
import { DevKit } from "./pages/DevKit/DevKit";
import { SessionCreation } from "./pages/CreateSession/CreateSession";
import { TaskPreview } from "./pages/TaskPreview/TaskPreview";
import { Home } from "./pages/Home/Home";
import { useAuth } from "./shared/auth/useAuth";
import { SessionDetails } from "./pages/SessionDetails/SessionDetails";
import { JoinSession } from "./pages/JoinSession/JoinSession";
import './App.css'

function App() {
  const { status } = useAuth();

  if (status === "loading") {
    return <div role="status">Загрузка...</div>;
  }

  return (
    <BrowserRouter basename="">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/devkit" element={<DevKit />} />
        <Route path="/create-session" element={<SessionCreation />} />
        <Route path="/create-session/preview" element={<TaskPreview />} />
        <Route path="/" element={<Home />} />
        <Route path="/sessions/:sessionId" element={<SessionDetails />} />
        <Route path="/join-session" element={<JoinSession />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
