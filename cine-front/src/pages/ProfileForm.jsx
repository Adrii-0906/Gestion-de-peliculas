import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const PREDEFINED_AVATARS = [
    "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
    "https://upload.wikimedia.org/wikipedia/commons/1/11/Blue_question_mark_icon.svg",
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
    "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1024px-User-avatar.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1024px-Default_pfp.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Crystal_Clear_kdm_user_female.svg/1024px-Crystal_Clear_kdm_user_female.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Crystal_Clear_app_Login_Manager.png/640px-Crystal_Clear_app_Login_Manager.png"
];

const ProfileForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState(PREDEFINED_AVATARS[0]);
    // Campos ocultos necesarios por el backend
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (isEdit) {
            api.get(`/usuarios/${id}`)
                .then(res => {
                    setUsername(res.data.username);
                    setAvatar(res.data.avatar || PREDEFINED_AVATARS[0]);
                    setEmail(res.data.email);
                    setPassword(res.data.password);
                })
                .catch(err => console.error(err));
        }
    }, [id, isEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            username,
            avatar,
            // Generar datos dummy si es nuevo
            email: isEdit ? email : `${username.replace(/\s+/g, '').toLowerCase()}@cine.com`,
            password: isEdit ? password : 'password123'
        };

        const request = isEdit
            ? api.put(`/usuarios/${id}`, data)
            : api.post('/usuarios', data);

        request
            .then(() => navigate('/manage-profiles'))
            .catch(err => {
                console.error(err);
                alert('Error al guardar el perfil. Asegúrate de que el nombre sea único (o el email generado).');
            });
    };

    const handleImageError = (e) => {
        e.target.src = "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png";
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#0f171e',
            color: 'white',
            padding: '40px'
        }}>
            <h1 style={{ marginBottom: '30px' }}>{isEdit ? 'Editar Perfil' : 'Añadir Perfil'}</h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%', maxWidth: '500px' }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <img
                        src={avatar}
                        alt="Preview"
                        onError={handleImageError}
                        style={{ width: '100px', height: '100px', borderRadius: '4px', objectFit: 'cover' }}
                    />
                    <div style={{ flexGrow: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#8197a4' }}>Nombre</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#666',
                                border: 'none',
                                color: 'white',
                                fontSize: '1.1rem'
                            }}
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '10px', color: '#8197a4' }}>Elige un Avatar</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                        {PREDEFINED_AVATARS.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`Avatar ${index}`}
                                onError={handleImageError}
                                onClick={() => setAvatar(url)}
                                style={{
                                    width: '100%',
                                    aspectRatio: '1/1',
                                    objectFit: 'cover',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    border: avatar === url ? '3px solid white' : '3px solid transparent',
                                    opacity: avatar === url ? 1 : 0.7
                                }}
                                onMouseEnter={(e) => e.target.style.opacity = 1}
                                onMouseLeave={(e) => e.target.style.opacity = avatar === url ? 1 : 0.7}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#8197a4' }}>O pega una URL personalizada</label>
                    <input
                        type="text"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        placeholder="https://..."
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: '#666',
                            border: 'none',
                            color: 'white'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button
                        type="submit"
                        style={{
                            flexGrow: 1,
                            backgroundColor: 'white',
                            color: 'black',
                            fontWeight: 'bold',
                            border: 'none',
                            padding: '15px'
                        }}
                    >
                        GUARDAR
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/manage-profiles')}
                        style={{
                            flexGrow: 1,
                            backgroundColor: 'transparent',
                            color: '#8197a4',
                            border: '1px solid #8197a4',
                            padding: '15px'
                        }}
                    >
                        CANCELAR
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileForm;
