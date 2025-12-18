package com.gestionPeliculas.web;

import com.gestionPeliculas.domain.Rol;
import com.gestionPeliculas.domain.Usuario;
import com.gestionPeliculas.dto.ComentarioDTO;
import com.gestionPeliculas.repository.UsuarioRepository;
import com.gestionPeliculas.service.ComentarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comentarios")
public class ComentarioController {

    private final ComentarioService comentarioService;
    private final UsuarioRepository usuarioRepository;

    public ComentarioController(ComentarioService comentarioService, UsuarioRepository usuarioRepository) {
        this.comentarioService = comentarioService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/pelicula/{peliculaId}")
    public ResponseEntity<List<ComentarioDTO>> getComentarios(@PathVariable Long peliculaId) {
        return ResponseEntity.ok(comentarioService.obtenerComentariosPorPelicula(peliculaId));
    }

    @GetMapping
    public ResponseEntity<List<ComentarioDTO>> getAllComentarios() {
        return ResponseEntity.ok(comentarioService.obtenerTodos());
    }

    @PostMapping
    public ResponseEntity<ComentarioDTO> createComentario(@RequestBody Map<String, Object> payload) {
        Long peliculaId = ((Number) payload.get("peliculaId")).longValue();
        String texto = (String) payload.get("texto");

        // Obtener usuario autenticado
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no autenticado"));

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(comentarioService.crearComentario(peliculaId, usuario.getId(), texto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComentario(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no autenticado"));

        boolean esAdmin = usuario.getRol() == Rol.ADMINISTRADOR;
        boolean esPropietario = comentarioService.esPropietario(id, usuario.getId());

        if (esAdmin || esPropietario) {
            comentarioService.eliminarComentario(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
