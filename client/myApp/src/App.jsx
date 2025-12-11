
import './App.css'
import { Routes, Route } from "react-router-dom"
import { RegisterComp } from './components/auth_comps/RegisterComp'
import { LogInComp } from './components/auth_comps/LogInComp'
import { HomeComp } from './components/app_comps/HomeComp'
import { NotFoundComp } from './components/NotFoundComp'
import { BrowserRouter as Router } from "react-router-dom";

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<LogInComp />} />
        <Route path='/register' element={<RegisterComp />} />
        <Route path='/home' element={<HomeComp />} />
        <Route path='*' element={<NotFoundComp />} />
      </Routes>
    </div>
  )
}

export default App