import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Auth from './pages/Auth'
import Home from './pages/Home'
import SingleMovie from './components/SingleMovie'
import SharedLayout from './components/SharedLayout'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<SharedLayout />}>
          <Route index element={<Home />} />
          <Route path="/home/:movieId" element={<SingleMovie />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
