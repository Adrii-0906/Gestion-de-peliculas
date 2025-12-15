import axios from 'axios';

const API_KEY = '902a810e1592fca7ecdc07b64ee70575';
const TMDB_URL = 'https://api.themoviedb.org/3';
const IMAGE_PATH = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_PATH = 'https://image.tmdb.org/t/p/original';

// Search for movies by title
export const searchMovies = async (query) => {
    if (!query || query.length < 2) return [];

    try {
        const response = await axios.get(`${TMDB_URL}/search/movie`, {
            params: {
                api_key: API_KEY,
                query: query,
                language: 'es-ES'
            }
        });

        return response.data.results.slice(0, 8).map(movie => ({
            tmdbId: movie.id,
            titulo: movie.title,
            poster: movie.poster_path ? `${IMAGE_PATH}${movie.poster_path}` : null,
            backdrop: movie.backdrop_path ? `${BACKDROP_PATH}${movie.backdrop_path}` : null,
            fechaEstreno: movie.release_date,
            sinopsis: movie.overview,
            valoracion: Math.round(movie.vote_average / 2) // Convert to 1-5 scale
        }));
    } catch (error) {
        console.error("Error searching TMDB:", error);
        return [];
    }
};

// Get full movie details including cast and crew
export const getFullMovieDetails = async (tmdbId) => {
    if (!tmdbId) return null;

    try {
        // Get movie details and credits in parallel
        const [detailsRes, creditsRes] = await Promise.all([
            axios.get(`${TMDB_URL}/movie/${tmdbId}`, {
                params: { api_key: API_KEY, language: 'es-ES' }
            }),
            axios.get(`${TMDB_URL}/movie/${tmdbId}/credits`, {
                params: { api_key: API_KEY, language: 'es-ES' }
            })
        ]);

        const movie = detailsRes.data;
        const credits = creditsRes.data;

        // Get director from crew
        const director = credits.crew.find(person => person.job === 'Director');

        // Get top 8 actors from cast
        const actors = credits.cast.slice(0, 8).map(actor => ({
            nombre: actor.name,
            character: actor.character,
            photo: actor.profile_path ? `${IMAGE_PATH}${actor.profile_path}` : null
        }));

        // Get genres
        const genres = movie.genres?.map(g => g.name) || [];

        return {
            tmdbId: movie.id,
            titulo: movie.title,
            sinopsis: movie.overview,
            duracion: movie.runtime,
            fechaEstreno: movie.release_date,
            valoracion: Math.round(movie.vote_average / 2),
            imagenUrl: movie.poster_path ? `${IMAGE_PATH}${movie.poster_path}` : null,
            backdrop: movie.backdrop_path ? `${BACKDROP_PATH}${movie.backdrop_path}` : null,
            director: director ? { nombre: director.name } : null,
            actores: actors,
            categorias: genres
        };
    } catch (error) {
        console.error("Error getting movie details:", error);
        return null;
    }
};

// Backward compatibility - get movie images by title
export const getMovieImages = async (titulo) => {
    if (!titulo) return null;

    try {
        const response = await axios.get(`${TMDB_URL}/search/movie`, {
            params: {
                api_key: API_KEY,
                query: titulo,
                language: 'es-ES'
            }
        });

        if (response.data.results.length > 0) {
            const movie = response.data.results[0];
            return {
                poster: movie.poster_path ? `${IMAGE_PATH}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image',
                backdrop: movie.backdrop_path ? `${BACKDROP_PATH}${movie.backdrop_path}` : null,
                overview: movie.overview,
                puntuacion: movie.vote_average
            };
        }
        return null;
    } catch (error) {
        console.error("Error contactando con TMDB:", error);
        return null;
    }
};

// Get movie trailer from TMDB by movie title
export const getMovieTrailer = async (titulo) => {
    if (!titulo) return null;

    try {
        // First search for the movie to get TMDB ID
        const searchRes = await axios.get(`${TMDB_URL}/search/movie`, {
            params: {
                api_key: API_KEY,
                query: titulo,
                language: 'es-ES'
            }
        });

        if (searchRes.data.results.length === 0) return null;

        const tmdbId = searchRes.data.results[0].id;

        // Get videos for the movie
        const videosRes = await axios.get(`${TMDB_URL}/movie/${tmdbId}/videos`, {
            params: {
                api_key: API_KEY,
                language: 'es-ES'
            }
        });

        // Try to find Spanish trailer first
        let trailer = videosRes.data.results.find(
            v => v.type === 'Trailer' && v.site === 'YouTube'
        );

        // If no Spanish trailer, try English
        if (!trailer) {
            const videosEnRes = await axios.get(`${TMDB_URL}/movie/${tmdbId}/videos`, {
                params: {
                    api_key: API_KEY,
                    language: 'en-US'
                }
            });
            trailer = videosEnRes.data.results.find(
                v => v.type === 'Trailer' && v.site === 'YouTube'
            );
        }

        if (trailer) {
            return {
                key: trailer.key,
                name: trailer.name,
                url: `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
            };
        }

        return null;
    } catch (error) {
        console.error("Error getting movie trailer:", error);
        return null;
    }
};