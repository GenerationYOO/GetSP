import { BrowserRouter } from "react-router-dom";
import './App.css'

function App() {

  return (
    <BrowserRouter basename="">
      <div className="app">
        <h1>Welcome to the App</h1>
      </div>
    </BrowserRouter>
  )
}

export default App
