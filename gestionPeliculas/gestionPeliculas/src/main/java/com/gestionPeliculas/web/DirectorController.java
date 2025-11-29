package com.gestionPeliculas.web;


import com.gestionPeliculas.DTOs.DirectorCreateUpdateDTO;
import com.gestionPeliculas.DTOs.DirectorDTO;
import com.gestionPeliculas.service.DirectorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/directores")
@RequiredArgsConstructor
public class DirectorController {

    private final DirectorService service;

    @GetMapping
    public List<DirectorDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public DirectorDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DirectorDTO agregar(@Valid @RequestBody DirectorCreateUpdateDTO dto) {
        return service.agregar(dto);
    }

    @PutMapping("/{id}")
    public DirectorDTO actualizar(@PathVariable Long id, @Valid @RequestBody DirectorCreateUpdateDTO dto) {
        return service.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
