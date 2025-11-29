package com.gestionPeliculas.web;


import com.gestionPeliculas.DTOs.IdiomaCreateUpdateDTO;
import com.gestionPeliculas.DTOs.IdiomaDTO;
import com.gestionPeliculas.service.IdiomaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/idomas")
@RequiredArgsConstructor
public class idiomaController {

    private final IdiomaService service;

    @GetMapping
    public List<IdiomaDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public IdiomaDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IdiomaDTO agregar(@Valid @RequestBody IdiomaCreateUpdateDTO dto) {
        return service.agregar(dto);
    }

    @PutMapping("/{id}")
    public IdiomaDTO actualizar(@PathVariable Long id, @Valid @RequestBody IdiomaCreateUpdateDTO dto) {
        return service.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }

}
