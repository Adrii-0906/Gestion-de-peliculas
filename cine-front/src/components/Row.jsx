import { Link } from 'react-router-dom';
import MoviePoster from './MoviePoster';

function Row({ titulo, peliculas }) {
  if (!peliculas || peliculas.length === 0) return null;

  return (
    <div style={{ marginBottom: '40px', paddingLeft: '20px' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#e5e5e5' }}>{titulo}</h2>

      <div style={{
        display: 'flex',
        gap: '15px',
        overflowX: 'auto', // Scroll lateral
        paddingBottom: '20px',
        scrollbarWidth: 'none' // Ocultar barra de scroll en Firefox
      }}>
        {/* Estilo para ocultar barra en Chrome */}
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>

        {peliculas.map(peli => (
          <Link key={peli.id} to={`/pelicula/${peli.id}`} style={{ minWidth: '200px', textDecoration: 'none', transition: 'transform 0.3s' }}>
             <div style={{ borderRadius: '4px', overflow: 'hidden' }}
                  onMouseEnter={e => e.currentTarget.parentElement.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.parentElement.style.transform = 'scale(1)'}
             >
                <MoviePoster titulo={peli.titulo} />
             </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Row;