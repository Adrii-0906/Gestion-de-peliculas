import { useEffect, useState } from 'react';
import { getMovieImages } from '../services/tmdb';

const MoviePoster = ({ titulo }) => {
    const [imgUrl, setImgUrl] = useState('https://via.placeholder.com/500x750?text=Cargando...');

    useEffect(() => {
        // Pedimos la foto a TMDB usando el título
        getMovieImages(titulo).then(data => {
            if (data && data.poster) {
                setImgUrl(data.poster);
            }
        });
    }, [titulo]);

    return (
        <img
            src={imgUrl}
            alt={titulo}
            style={{ width: '100%', height: '300px', objectFit: 'cover' }}
        />
    );
};

export default MoviePoster;