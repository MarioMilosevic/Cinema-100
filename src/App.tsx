import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Authentication from './pages/Authentication'
import Home from './pages/Home'
import SingleMovie from './components/SingleMovie'
import SharedLayout from './components/SharedLayout'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Authentication />} />
        <Route path="/home" element={<SharedLayout />}>
          <Route index element={<Home />} />
          <Route path="/home/:movieId" element={<SingleMovie />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
