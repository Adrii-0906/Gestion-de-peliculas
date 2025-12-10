import React from 'react';
import { Link } from 'react-router-dom';
import './Row.css'; // Asegúrate de crear este archivo CSS que te paso abajo

const Row = ({ titulo, peliculas }) => {

    // URL base por si las imágenes vienen solo con la ruta parcial (tipo TMDB)
    // Si tus URLs ya son completas (http...), esto no romperá nada.
    const base_url = "https://image.tmdb.org/t/p/original/";

    return (
        <div className="row-container">
            <h2 className="row-title">{titulo}</h2>

            <div className="row-posters">
                {peliculas.map(movie => (
                    // --- AQUÍ ESTÁ EL ARREGLO: 'peliculas' en PLURAL ---
                    <Link key={movie.id} to={`/peliculas/${movie.id}`}>
                       <img
                           className="row-poster"
                           // Si hay URL úsala, si no, pon la imagen de relleno
                           src={movie.imagenUrl ? movie.imagenUrl : "https://via.placeholder.com/200x300?text=Sin+Imagen"}
                           alt={movie.titulo}
                           // Si la URL existía pero falló al cargar, pon la imagen de error
                           onError={(e) => {
                               e.target.onerror = null;
                               e.target.src = "https://via.placeholder.com/200x300?text=No+Disponible";
                           }}
                       />
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Row;