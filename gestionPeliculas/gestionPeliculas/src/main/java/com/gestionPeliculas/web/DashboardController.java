package com.gestionPeliculas.web;

import com.gestionPeliculas.repository.ComentarioRepository;
import com.gestionPeliculas.repository.PeliculaRepository;
import com.gestionPeliculas.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class DashboardController {

    private final UsuarioRepository usuarioRepository;
    private final PeliculaRepository peliculaRepository;
    private final ComentarioRepository comentarioRepository;

    public DashboardController(UsuarioRepository usuarioRepository,
            PeliculaRepository peliculaRepository,
            ComentarioRepository comentarioRepository) {
        this.usuarioRepository = usuarioRepository;
        this.peliculaRepository = peliculaRepository;
        this.comentarioRepository = comentarioRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("userCount", usuarioRepository.count());
        stats.put("movieCount", peliculaRepository.count());
        stats.put("commentCount", comentarioRepository.count());

        return ResponseEntity.ok(stats);
    }
}
