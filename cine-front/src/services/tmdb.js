import axios from 'axios';

// API Key desde variable de entorno
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
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
                poster: movie.poster_path ? `${IMAGE_PATH}${movie.poster_path}` : "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiB2aWV3Qm94PSIwIDAgNTAwIDc1MCI+CiAgPHJlY3Qgd2lkdGg9IjUwMCIgaGVpZ2h0PSI3NTAiIGZpbGw9IiMzMzMiIC8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iNDAiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=",
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

// Get movie age certification from TMDB
export const getMovieCertification = async (titulo) => {
    if (!titulo) return null;

    try {
        // Search for movie to get TMDB ID
        const searchRes = await axios.get(`${TMDB_URL}/search/movie`, {
            params: {
                api_key: API_KEY,
                query: titulo,
                language: 'es-ES'
            }
        });

        if (searchRes.data.results.length === 0) return null;

        const tmdbId = searchRes.data.results[0].id;

        // Get release dates with certifications
        const releaseRes = await axios.get(`${TMDB_URL}/movie/${tmdbId}/release_dates`, {
            params: { api_key: API_KEY }
        });

        // Try to find Spain (ES) certification first, then US
        const countries = ['ES', 'US', 'GB', 'DE', 'FR'];
        let certification = null;

        for (const country of countries) {
            const release = releaseRes.data.results.find(r => r.iso_3166_1 === country);
            if (release && release.release_dates.length > 0) {
                const cert = release.release_dates.find(rd => rd.certification)?.certification;
                if (cert) {
                    certification = cert;
                    break;
                }
            }
        }

        // Convert certification to our age system
        if (!certification) return 12; // Default

        // Map common certifications to our system
        const certMap = {
            // Spain
            'TP': 0, 'Apta': 0, 'APTA': 0,
            '7': 7, '+7': 7,
            '12': 12, '+12': 12,
            '16': 16, '+16': 16,
            '18': 18, '+18': 18, 'X': 18,
            // US
            'G': 0, 'PG': 7, 'PG-13': 12, 'R': 16, 'NC-17': 18,
            // UK
            'U': 0, 'PG': 7, '12A': 12, '15': 16, '18': 18,
            // Germany
            '0': 0, '6': 7, '16': 16
        };

        return certMap[certification] ?? 12;
    } catch (error) {
        console.error("Error getting certification:", error);
        return 12;
    }
};