package com.gestionPeliculas.web;

import com.gestionPeliculas.DTOs.ActorCreateUpdateDTO;
import com.gestionPeliculas.DTOs.ActorDTO;
import com.gestionPeliculas.service.ActorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/actores")
@RequiredArgsConstructor
public class ActorController {

    private final ActorService service;


    @GetMapping
    public List<ActorDTO> listar() {
        return service.listar();
    }


    @GetMapping("/{id}")
    public ActorDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ActorDTO agregar(@Valid @RequestBody ActorCreateUpdateDTO actor) {
        return service.anadirActor(actor);
    }

    @PutMapping("/{id}")
    public ActorDTO actualizar(@PathVariable Long id, @Valid @RequestBody ActorCreateUpdateDTO actor) {
        return service.actualizar(id, actor);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
