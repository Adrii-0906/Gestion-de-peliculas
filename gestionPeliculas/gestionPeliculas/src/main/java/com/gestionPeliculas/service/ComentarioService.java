package com.gestionPeliculas.service;

import com.gestionPeliculas.domain.Comentario;
import com.gestionPeliculas.domain.Pelicula;
import com.gestionPeliculas.domain.Usuario;
import com.gestionPeliculas.dto.ComentarioDTO;
import com.gestionPeliculas.repository.ComentarioRepository;
import com.gestionPeliculas.repository.PeliculaRepository;
import com.gestionPeliculas.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComentarioService {

    private final ComentarioRepository comentarioRepository;
    private final PeliculaRepository peliculaRepository;
    private final UsuarioRepository usuarioRepository;

    public ComentarioService(ComentarioRepository comentarioRepository, PeliculaRepository peliculaRepository,
            UsuarioRepository usuarioRepository) {
        this.comentarioRepository = comentarioRepository;
        this.peliculaRepository = peliculaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<ComentarioDTO> obtenerComentariosPorPelicula(Long peliculaId) {
        return comentarioRepository.findByPeliculaIdOrderByFechaDesc(peliculaId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ComentarioDTO crearComentario(Long peliculaId, Long usuarioId, String texto) {
        Pelicula pelicula = peliculaRepository.findById(peliculaId)
                .orElseThrow(() -> new RuntimeException("Pelicula no encontrada"));
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Comentario comentario = new Comentario(texto, usuario, pelicula);
        comentario = comentarioRepository.save(comentario);

        return convertToDTO(comentario);
    }

    @Transactional
    public void eliminarComentario(Long comentarioId) {
        comentarioRepository.deleteById(comentarioId);
    }

    @Transactional(readOnly = true)
    public ComentarioDTO obtenerComentario(Long id) {
        Comentario comentario = comentarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comentario no encontrado"));
        return convertToDTO(comentario);
    }

    // Helper para verificar propiedad del comentario
    @Transactional(readOnly = true)
    public boolean esPropietario(Long comentarioId, Long usuarioId) {
        return comentarioRepository.findById(comentarioId)
                .map(c -> c.getUsuario().getId().equals(usuarioId))
                .orElse(false);
    }

    @Transactional(readOnly = true)
    public List<ComentarioDTO> obtenerTodos() {
        return comentarioRepository.findAll().stream()
                .sorted((c1, c2) -> c2.getFecha().compareTo(c1.getFecha())) // Sort in memory or use repository method
                                                                            // if available
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ComentarioDTO convertToDTO(Comentario comentario) {
        return new ComentarioDTO(
                comentario.getId(),
                comentario.getTexto(),
                comentario.getFecha(),
                comentario.getUsuario().getId(),
                comentario.getUsuario().getUsername(),
                comentario.getUsuario().getAvatar(),
                comentario.getPelicula().getId(),
                comentario.getPelicula().getTitulo());
    }
}
