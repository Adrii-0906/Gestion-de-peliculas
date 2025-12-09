import axios from 'axios';

// 🔴 PEGA TU CLAVE AQUÍ ABAJO ENTRE LAS COMILLAS
const API_KEY = '902a810e1592fca7ecdc07b64ee70575';

const TMDB_URL = 'https://api.themoviedb.org/3';
const IMAGE_PATH = 'https://image.tmdb.org/t/p/w500';      // Para pósters normales
const BACKDROP_PATH = 'https://image.tmdb.org/t/p/original'; // Para fondos HD gigantes

// Función para buscar imágenes por título
export const getMovieImages = async (titulo) => {
    if (!titulo) return null;

    try {
        const response = await axios.get(`${TMDB_URL}/search/movie`, {
            params: {
                api_key: API_KEY,
                query: titulo,
                language: 'es-ES' // Para que devuelva carteles en español si hay
            }
        });

        if (response.data.results.length > 0) {
            const movie = response.data.results[0];
            return {
                poster: movie.poster_path ? `${IMAGE_PATH}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image',
                backdrop: movie.backdrop_path ? `${BACKDROP_PATH}${movie.backdrop_path}` : null,
                overview: movie.overview, // Sinopsis de TMDB (a veces es mejor que la nuestra)
                puntuacion: movie.vote_average
            };
        }
        return null;
    } catch (error) {
        console.error("Error contactando con TMDB:", error);
        return null;
    }
};