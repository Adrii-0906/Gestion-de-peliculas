import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ProfileManager = () => {
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = () => {
        api.get('/usuarios')
            .then(res => setProfiles(res.data))
            .catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este perfil?')) {
            api.delete(`/usuarios/${id}`)
                .then(() => fetchProfiles())
                .catch(err => console.error(err));
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: '100px',
            minHeight: '100vh',
            backgroundColor: '#0f171e',
            color: 'white',
            padding: '20px'
        }}>
            <h1 style={{ marginBottom: '40px', fontSize: '2.5rem' }}>Administrar perfiles</h1>

            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '50px' }}>
                {profiles.map(profile => (
                    <div key={profile.id} style={{ position: 'relative', textAlign: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <img
                                src={profile.avatar || "https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-qo9h82134t9nv0j0.jpg"}
                                alt={profile.username}
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    borderRadius: '4px',
                                    objectFit: 'cover',
                                    opacity: 0.5
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                                onClick={() => navigate(`/manage-profiles/edit/${profile.id}`)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </div>
                        </div>
                        <h3 style={{ marginTop: '10px', color: '#8197a4' }}>{profile.username}</h3>
                        <button
                            onClick={() => handleDelete(profile.id)}
                            style={{
                                marginTop: '5px',
                                backgroundColor: 'red',
                                color: 'white',
                                border: 'none',
                                padding: '5px 10px',
                                fontSize: '0.8rem',
                                borderRadius: '4px'
                            }}
                        >
                            Eliminar
                        </button>
                    </div>
                ))}

                <div
                    onClick={() => navigate('/manage-profiles/new')}
                    style={{
                        width: '150px',
                        height: '150px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        borderRadius: '50%',
                        border: '2px dashed #8197a4'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'white';
                        e.currentTarget.querySelector('svg').style.stroke = 'white';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#8197a4';
                        e.currentTarget.querySelector('svg').style.stroke = '#8197a4';
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#8197a4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </div>
            </div>

            <button
                onClick={() => navigate('/')}
                style={{
                    backgroundColor: 'white',
                    color: 'black',
                    padding: '10px 30px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    border: 'none'
                }}
            >
                LISTO
            </button>
        </div>
    );
};

export default ProfileManager;
