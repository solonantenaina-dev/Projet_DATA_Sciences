import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Cartographie from './pages/Cartographie'
import Doleances from './pages/Doleances'
import Indicateurs from './pages/Indicateurs'

function App() {
  return (
    <div className="app">
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cartographie" element={<Cartographie />} />
          <Route path="/doleances" element={<Doleances />} />
          <Route path="/indicateurs" element={<Indicateurs />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
