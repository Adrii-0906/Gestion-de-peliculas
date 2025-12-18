import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import HeroCarousel from '../components/HeroCarousel';
import Row from '../components/Row';

function Home() {
  const [peliculas, setPeliculas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [peliculasRes, categoriasRes] = await Promise.all([
          api.get('/peliculas'),
          api.get('/categorias').catch(() => ({ data: [] }))
        ]);
        setPeliculas(peliculasRes.data.reverse());
        setCategorias(categoriasRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter movies by category
  const getPeliculasByCategoria = (nombreCategoria) => {
    return peliculas.filter(p =>
      p.categorias?.some(c => c.nombre?.toLowerCase().includes(nombreCategoria.toLowerCase()))
    );
  };

  const [currentProfile] = useState(() => JSON.parse(localStorage.getItem('currentProfile')));
  const isKidsProfile = currentProfile?.isKids || false;

  // Filter movies for Kids profile
  const filteredPeliculas = isKidsProfile
    ? peliculas.filter(p =>
      p.categorias?.some(c =>
        ['Animación', 'Familia'].some(k => c.nombre?.toLowerCase().includes(k.toLowerCase()))
      )
    )
    : peliculas;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F171E' }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-full animate-spin"
            style={{ border: '4px solid #00A8E1', borderTopColor: 'transparent' }}
          ></div>
          <p style={{ color: '#8197A4' }}>Cargando contenido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F171E' }}>
      {/* Hero Section */}
      {filteredPeliculas.length > 0 && (
        <HeroCarousel peliculas={filteredPeliculas.slice(0, 5)} />
      )}

      {/* Content Rows - Overlapping Hero */}
      <div className="relative z-10 pb-20 space-y-2" style={{ marginTop: '-80px' }}>

        {isKidsProfile ? (
          <>
            <Row titulo="Películas Infantiles Destacadas" peliculas={getPeliculasByCategoria('Animación')} />
            <Row titulo="Aventuras para todos" peliculas={getPeliculasByCategoria('Familia')} />
            <Row titulo="Comedia y Diversión" peliculas={getPeliculasByCategoria('Comedia')} />
            <Row titulo="Fantasía Mágica" peliculas={getPeliculasByCategoria('Fantasía')} />
            <Row titulo="Todo el catálogo infantil" peliculas={filteredPeliculas} />
          </>
        ) : (
          <>
            {/* Recently Added */}
            <Row
              titulo="Agregadas recientemente"
              peliculas={peliculas.slice(0, 15)}
            />

            {/* Top 10 This Week */}
            <Row
              titulo="Top 10 en España esta semana"
              peliculas={peliculas.slice(0, 10)}
              isTop10={true}
            />

            {/* Dynamic Cateogires */}
            <Row titulo="Acción y adrenalina" peliculas={getPeliculasByCategoria('Acción')} />
            <Row titulo="Ciencia Ficción" peliculas={getPeliculasByCategoria('Ciencia Ficción')} />
            <Row titulo="Dramas aclamados" peliculas={getPeliculasByCategoria('Drama')} />
            <Row titulo="Terror y Suspense" peliculas={getPeliculasByCategoria('Terror')} />
            <Row titulo="Comedias románticas" peliculas={getPeliculasByCategoria('Romance')} />

            {/* All Movies */}
            <Row
              titulo="Explorar todo el catálogo"
              peliculas={peliculas}
            />
          </>
        )}

      </div>
    </div>
  );
}

export default Home;