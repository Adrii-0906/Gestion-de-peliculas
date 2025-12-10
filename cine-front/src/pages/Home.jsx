import { useEffect, useState } from 'react';
import api from '../services/api'; // O axios, lo que uses
import HeroCarousel from '../components/HeroCarousel';
import Row from '../components/Row';

function Home() {
  const [peliculas, setPeliculas] = useState([]);

  useEffect(() => {
    // Al cargar, pedimos todas las pelis y las invertimos para ver las nuevas primero
    api.get('/peliculas') // O axios.get('http://localhost:8081/api/peliculas')
      .then(res => setPeliculas(res.data.reverse()))
      .catch(err => console.error(err));
  }, []);

  // Filtros manuales (estos solo muestran las famosas)
  const animacion = peliculas.filter(p => ["Spider-Man: Cruzando el Multiverso", "Coco", "Toy Story", "El Rey León"].includes(p.titulo));
  const accion = peliculas.filter(p => ["Gladiator", "Matrix", "Top Gun: Maverick", "The Batman"].includes(p.titulo));

  // PARA QUE SALGAN LAS TUYAS:
  // Cogemos todas las películas sin filtrar
  const todas = peliculas;

  return (
    <div style={{ paddingBottom: '50px', backgroundColor: '#111' }}>

      {/* Hero Carousel con las 5 más recientes */}
      {peliculas.length > 0 && <HeroCarousel peliculas={peliculas.slice(0, 5)} />}

      <div style={{ marginTop: '-50px', position: 'relative', zIndex: 10 }}>

        {/* --- ESTA ES LA FILA NUEVA QUE NECESITAS --- */}
        <Row titulo="🎥 Agregadas Recientemente" peliculas={todas} />
        {/* ------------------------------------------ */}

        <Row titulo="Acción y Adrenalina" peliculas={accion} />
        <Row titulo="Mundos Animados" peliculas={animacion} />

        {/* Puedes añadir más categorías si quieres */}

      </div>
    </div>
  );
}

export default Home;