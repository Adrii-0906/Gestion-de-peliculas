import { Routes, Route } from 'react-router-dom';

// IMPORTS
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PeliculaForm from './components/PeliculaForm';

// CORRECCIÓN AQUÍ: Importa el archivo con SU NOMBRE REAL
import PeliculaDetail from './pages/PeliculaDetail';

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* CORRECCIÓN AQUÍ: Usa el componente con el nombre nuevo */}
        <Route path="/peliculas/:id" element={<PeliculaDetail />} />

        <Route path="/crear-pelicula" element={<PeliculaForm />} />
      </Routes>
    </>
  );
}

export default App;