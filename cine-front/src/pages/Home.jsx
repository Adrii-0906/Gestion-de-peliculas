import { useEffect, useState } from 'react';
import api from '../services/api';
import HeroCarousel from '../components/HeroCarousel';
import Row from '../components/Row'; // Importamos el componente de filas

function Home() {
  const [peliculas, setPeliculas] = useState([]);

  useEffect(() => {
    api.get('/peliculas')
      .then(res => setPeliculas(res.data))
      .catch(err => console.error(err));
  }, []);

  // --- LÓGICA DE SECCIONES (Simulada por ahora) ---

  // 1. Relevantes: Las primeras 5 (Dune, Oppenheimer...)
  const relevantes = peliculas.slice(0, 5);

  // 2. Ciencia Ficción: Filtramos por títulos conocidos (o por posición en el array)
  // En el futuro lo harás por peli.categoria.nombre === 'Ciencia Ficción'
  const cienciaFiccion = peliculas.filter(p =>
      ["Interstellar", "Origen", "Blade Runner 2049", "Matrix", "Star Wars: Una nueva esperanza"].includes(p.titulo)
  );

  // 3. Españolas
  const espanolas = peliculas.filter(p =>
      ["La sociedad de la nieve", "El laberinto del fauno", "Los otros", "Celda 211", "Contratiempo"].includes(p.titulo)
  );

  // 4. Todo el catálogo (por si quieres ver el resto)
  const resto = peliculas.slice(15);

  return (
    <div style={{ paddingBottom: '50px' }}>

      {/* SECCIÓN HERO (Lo más relevante en grande) */}
      {relevantes.length > 0 && <HeroCarousel peliculas={relevantes} />}

      {/* SECCIÓN FILAS (Scroll horizontal) */}
      <div style={{ marginTop: '-50px', position: 'relative', zIndex: 10 }}>

        <Row titulo="Ciencia Ficción y Fantasía" peliculas={cienciaFiccion} />

        <Row titulo="Cine Español" peliculas={espanolas} />

        <Row titulo="Añadidas Recientemente" peliculas={relevantes} />

      </div>
    </div>
  );
}

export default Home;