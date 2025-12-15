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

  // Predefined category filters (fallback)
  const accion = peliculas.filter(p =>
    ["Gladiator", "Matrix", "Top Gun: Maverick", "The Batman", "Mad Max"].some(t => p.titulo?.includes(t))
  );

  const animacion = peliculas.filter(p =>
    ["Spider-Man: Cruzando el Multiverso", "Coco", "Toy Story", "El Rey León", "Chihiro"].some(t => p.titulo?.includes(t))
  );

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
      {peliculas.length > 0 && (
        <HeroCarousel peliculas={peliculas.slice(0, 5)} />
      )}

      {/* Content Rows - Overlapping Hero */}
      <div className="relative z-10 pb-20 space-y-2" style={{ marginTop: '-80px' }}>

        {/* Recently Added */}
        <Row
          titulo="Agregadas recientemente"
          peliculas={peliculas.slice(0, 15)}
        />

        {/* Continue Watching (Simulated) */}
        <Row
          titulo="Continúa viendo"
          peliculas={peliculas.slice(3, 10)}
        />

        {/* Top 10 This Week - FIXED SCROLLING */}
        <div className="py-4 group">
          <div className="px-6 lg:px-10 mb-3">
            <h2 className="text-lg lg:text-xl font-semibold text-white flex items-center gap-2">
              <span style={{ color: '#00A8E1' }}>Top 10</span> en España esta semana
            </h2>
          </div>
          <div
            className="flex gap-3 overflow-x-auto px-6 lg:px-10 pb-4 scrollbar-hide"
            style={{ scrollBehavior: 'smooth', scrollSnapType: 'x mandatory' }}
          >
            {peliculas.slice(0, 10).map((movie, index) => (
              <Link
                key={movie.id}
                to={`/peliculas/${movie.id}`}
                className="flex-shrink-0 flex items-end gap-1 group/item"
                style={{ scrollSnapAlign: 'start' }}
              >
                {/* Number */}
                <div
                  className="relative"
                  style={{
                    fontSize: index === 9 ? '5rem' : '6rem',
                    fontWeight: '800',
                    lineHeight: '0.8',
                    WebkitTextStroke: '2px #425265',
                    color: 'transparent',
                    marginRight: index === 9 ? '-15px' : '-10px',
                    zIndex: 1
                  }}
                >
                  {index + 1}
                </div>
                {/* Movie Poster */}
                <div
                  className="relative rounded-lg overflow-hidden transition-transform duration-300 group-hover/item:scale-105"
                  style={{
                    width: '120px',
                    height: '180px',
                    backgroundColor: '#1A242F',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                  }}
                >
                  <img
                    src={movie.imagenUrl || "https://via.placeholder.com/120x180?text=Sin+Imagen"}
                    alt={movie.titulo}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/120x180?text=Error";
                    }}
                  />
                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                    >
                      <svg className="w-5 h-5 ml-0.5" style={{ color: '#0F171E' }} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {/* Extra padding at end for scroll */}
            <div className="flex-shrink-0 w-10"></div>
          </div>
        </div>

        {/* Action Movies */}
        {accion.length > 0 && (
          <Row titulo="Acción y aventura" peliculas={accion} />
        )}

        {/* Animation */}
        {animacion.length > 0 && (
          <Row titulo="Animación y familia" peliculas={animacion} />
        )}

        {/* All Movies */}
        <Row
          titulo="Explorar todo el catálogo"
          peliculas={peliculas}
        />

        {/* Categories from API */}
        {categorias.slice(0, 4).map(categoria => {
          const pelisCategoria = getPeliculasByCategoria(categoria.nombre);
          if (pelisCategoria.length === 0) return null;
          return (
            <Row
              key={categoria.id}
              titulo={categoria.nombre}
              peliculas={pelisCategoria}
            />
          );
        })}

      </div>
    </div>
  );
}

export default Home;