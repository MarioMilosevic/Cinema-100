import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Authentication from './pages/Authentication'
import Home from './pages/Home'
import SingleMovie from './components/SingleMovie'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Authentication />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/:movieId" element={<SingleMovie />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
