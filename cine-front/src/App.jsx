import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
// BORRA LA LÍNEA DE IMPORT PELICULAFORM
import PeliculaDetail from './pages/PeliculaDetail';

function App() {
  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh', color: 'white' }}>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* BORRA LA LÍNEA DE ROUTE /crear */}

        <Route path="/pelicula/:id" element={<PeliculaDetail />} />
      </Routes>
    </div>
  );
}

export default App;