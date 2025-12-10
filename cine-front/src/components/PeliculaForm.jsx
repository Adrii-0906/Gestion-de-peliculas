import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PeliculaForm = () => {
    const navigate = useNavigate();

    // --- ESTADOS ---
    const [formData, setFormData] = useState({
        titulo: '', sinopsis: '', duracion: '', fechaEstreno: '',
        valoracion: 5, imagenUrl: '',
        // AHORA USAMOS TEXTO LIBRE
        nombreDirector: '',
        actoresInput: ''
    });
    const [focusedInput, setFocusedInput] = useState(null);

    // --- HANDLERS ---
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFocus = (e) => setFocusedInput(e.target.name);
    const handleBlur = () => setFocusedInput(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Transformamos el texto "Actor A, Actor B" en una lista ["Actor A", "Actor B"]
        const datosParaEnviar = {
            ...formData,
            nombresActores: formData.actoresInput.split(',').map(n => n.trim()).filter(n => n !== "")
        };

        try {
            await axios.post('http://localhost:8081/api/peliculas', datosParaEnviar);
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Error al guardar. Revisa que el Backend esté encendido.');
        }
    };

    // --- ESTILOS ---
    const styles = {
        mainContainer: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #000 0%, #141414 100%)',
            paddingTop: '100px', paddingBottom: '60px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        },
        glassPanel: {
            backgroundColor: 'rgba(20, 20, 20, 0.95)',
            borderRadius: '20px', border: '1px solid #333',
            boxShadow: '0 0 50px rgba(0,0,0,0.8)',
            maxWidth: '1200px', width: '95%', overflow: 'hidden'
        },
        header: {
            padding: '30px 40px', borderBottom: '1px solid #333',
            background: 'linear-gradient(90deg, rgba(229,9,20,0.1) 0%, transparent 100%)'
        },
        body: { padding: '40px' },
        posterPreview: {
            width: '100%', height: '500px', backgroundColor: '#0a0a0a',
            borderRadius: '12px', border: '2px dashed #333',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', marginBottom: '15px'
        },
        label: {
            color: '#888', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px', display: 'block'
        },
        input: (name) => ({
            backgroundColor: '#1a1a1a',
            border: focusedInput === name ? '1px solid #e50914' : '1px solid #333',
            color: 'white', borderRadius: '6px', padding: '12px', width: '100%',
            transition: 'all 0.3s', outline: 'none',
            boxShadow: focusedInput === name ? '0 0 15px rgba(229, 9, 20, 0.3)' : 'none'
        }),
        btnSave: {
            background: '#e50914', border: 'none', color: 'white', padding: '12px 40px',
            borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(229,9,20,0.4)'
        }
    };

    return (
        <div style={styles.mainContainer}>
            <div style={styles.glassPanel}>
                <div style={styles.header}>
                    <h2 className="m-0 text-white fw-light">Nueva <span className="fw-bold text-danger">Película</span></h2>
                </div>

                <div style={styles.body}>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-5">
                            {/* IZQUIERDA: PÓSTER */}
                            <div className="col-lg-4">
                                <label style={styles.label}>Vista Previa</label>
                                <div style={styles.posterPreview}>
                                    {formData.imagenUrl ? (
                                        <img src={formData.imagenUrl} alt="Preview" style={{width:'100%', height:'100%', objectFit:'cover'}} onError={(e)=>e.target.style.display='none'}/>
                                    ) : <span className="text-secondary">Sin Imagen</span>}
                                </div>
                                <label style={styles.label}>URL Imagen</label>
                                <input type="text" name="imagenUrl" style={styles.input('imagenUrl')}
                                       value={formData.imagenUrl} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} required placeholder="https://..." />
                            </div>

                            {/* DERECHA: DATOS */}
                            <div className="col-lg-8">
                                <div className="mb-4">
                                    <label style={styles.label}>Título</label>
                                    <input type="text" name="titulo" style={{...styles.input('titulo'), fontSize: '1.5rem', fontWeight:'bold'}}
                                           value={formData.titulo} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} required />
                                </div>
                                <div className="mb-4">
                                    <label style={styles.label}>Sinopsis</label>
                                    <textarea name="sinopsis" rows="3" style={styles.input('sinopsis')}
                                              value={formData.sinopsis} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} required />
                                </div>

                                {/* DATOS TÉCNICOS */}
                                <div className="row g-3 mb-4">
                                    <div className="col-md-4">
                                        <label style={styles.label}>Estreno</label>
                                        <input type="date" name="fechaEstreno" style={styles.input('fechaEstreno')}
                                               value={formData.fechaEstreno} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} required />
                                    </div>
                                    <div className="col-md-4">
                                        <label style={styles.label}>Duración (min)</label>
                                        <input type="number" name="duracion" style={styles.input('duracion')}
                                               value={formData.duracion} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} required />
                                    </div>
                                    <div className="col-md-4">
                                        <label style={styles.label}>Valoración</label>
                                        <input type="number" name="valoracion" min="0" max="10" style={{...styles.input('valoracion'), color:'#e50914', fontWeight:'bold'}}
                                               value={formData.valoracion} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} required />
                                    </div>
                                </div>

                                {/* EQUIPO - AHORA SON TEXTOS PARA ESCRIBIR */}
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label style={styles.label}>Director (Nombre Completo)</label>
                                        <input type="text" name="nombreDirector" style={styles.input('nombreDirector')}
                                               placeholder="Ej: James Cameron"
                                               value={formData.nombreDirector} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} />
                                    </div>
                                    <div className="col-md-6">
                                        <label style={styles.label}>Reparto (Separado por comas)</label>
                                        <input type="text" name="actoresInput" style={styles.input('actoresInput')}
                                               placeholder="Ej: Leonardo DiCaprio, Kate Winslet"
                                               value={formData.actoresInput} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} />
                                    </div>
                                </div>

                                <div className="text-end mt-5">
                                    <button type="button" onClick={() => navigate('/')} className="btn btn-outline-secondary me-3 rounded-pill px-4">Cancelar</button>
                                    <button type="submit" style={styles.btnSave}>GUARDAR PELÍCULA</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PeliculaForm;