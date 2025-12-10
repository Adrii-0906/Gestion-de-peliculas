import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Detectamos si el usuario hace scroll para cambiar el color de fondo
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Estilos del contenedor principal (Nav)
  const navStyle = {
    position: 'fixed',
    top: 0,
    width: '100%',
    height: '70px',
    zIndex: 100,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 40px',
    boxSizing: 'border-box',
    transition: 'background-color 0.5s ease',
    // Si hay scroll: Negro. Si no: Transparente
    backgroundColor: isScrolled ? '#141414' : 'transparent',
    background: isScrolled ? '#141414' : 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)'
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#e5e5e5',
    fontSize: '0.9rem',
    marginLeft: '20px',
    transition: 'color 0.3s'
  };

  return (
    <nav style={navStyle}>

      {/* IZQUIERDA: Logo y Enlaces */}
      <div style={{ display: 'flex', alignItems: 'center' }}>

        {/* LOGO "CINEVERSE" */}
        <Link to="/" style={{ textDecoration: 'none', marginRight: '40px' }}>
          <h1 style={{
            color: '#e50914',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            margin: 0,
            letterSpacing: '2px'
          }}>
            CINEVERSE
          </h1>
        </Link>

        {/* SECCIONES DEL MENÚ */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ ...linkStyle, fontWeight: 'bold', color: 'white' }}>Inicio</Link>
          <Link to="/" style={linkStyle}>Películas</Link>
          <Link to="/" style={linkStyle}>Novedades</Link>
          <Link to="/" style={linkStyle}>Mi Lista</Link>

          {/* --- AQUÍ ESTÁ TU NUEVO BOTÓN --- */}
          <Link to="/crear-pelicula" style={{
              ...linkStyle,
              color: '#e50914', // Le ponemos rojo para que destaque un poco
              fontWeight: 'bold'
          }}>
            + Agregar Película
          </Link>

        </div>
      </div>

      {/* DERECHA: Iconos */}
      <div style={{ display: 'flex', gap: '20px', color: 'white', alignItems: 'center' }}>
        <span style={{ cursor: 'pointer' }}>🔍</span>
        <span style={{ cursor: 'pointer' }}>🔔</span>

        {/* Avatar simple */}
        <div style={{
            width: '32px', height: '32px',
            borderRadius: '4px',
            backgroundColor: '#0071eb',
            cursor: 'pointer'
        }}></div>
      </div>

    </nav>
  );
}

export default Navbar;