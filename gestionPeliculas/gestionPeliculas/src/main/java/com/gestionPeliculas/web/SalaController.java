package com.gestionPeliculas.web;


import com.gestionPeliculas.DTOs.SalaCreateUpdateDTO;
import com.gestionPeliculas.DTOs.SalaDTO;
import com.gestionPeliculas.service.SalaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salas")
@RequiredArgsConstructor
public class SalaController {

    private final SalaService service;

    @GetMapping
    public List<SalaDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public SalaDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SalaDTO agregar(@Valid @RequestBody SalaCreateUpdateDTO dto) {
        return service.agregar(dto);
    }

    @PutMapping("/{id}")
    public SalaDTO actualizar(@PathVariable Long id, @Valid @RequestBody SalaCreateUpdateDTO dto) {
        return service.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
