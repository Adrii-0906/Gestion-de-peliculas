import { useEffect, useState } from 'react';
import { getMovieImages } from '../services/tmdb';

const MoviePoster = ({ titulo }) => {
    const [imgUrl, setImgUrl] = useState("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiB2aWV3Qm94PSIwIDAgNTAwIDc1MCI+CiAgPHJlY3Qgd2lkdGg9IjUwMCIgaGVpZ2h0PSI3NTAiIGZpbGw9IiMyMDMwNDAiIC8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iNDAiPkxvYWRpbmc8L3RleHQ+Cjwvc3ZnPg==");

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