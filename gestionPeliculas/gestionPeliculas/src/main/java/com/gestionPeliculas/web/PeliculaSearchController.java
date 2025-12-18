package com.gestionPeliculas.web;

import com.gestionPeliculas.DTOs.PeliculaDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/peliculas/search")
@RequiredArgsConstructor
public class PeliculaSearchController {

    private final com.gestionPeliculas.service.PeliculaService peliculaService;

    @GetMapping
    public List<PeliculaDTO> search(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer rating) {
        return peliculaService.buscar(query, categoriaId, year, rating);
    }
}
