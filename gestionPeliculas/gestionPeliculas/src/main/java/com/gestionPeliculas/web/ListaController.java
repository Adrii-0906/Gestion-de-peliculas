package com.gestionPeliculas.web;

import com.gestionPeliculas.domain.ListaItem;
import com.gestionPeliculas.service.ListaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lista")
@RequiredArgsConstructor
public class ListaController {

    private final ListaService service;

    @GetMapping("/usuario/{usuarioId}")
    public List<ListaItem> obtenerLista(@PathVariable Long usuarioId, @RequestParam String profileName) {
        return service.obtenerLista(usuarioId, profileName);
    }

    @GetMapping("/check/{usuarioId}/{peliculaId}")
    public boolean verificarEstado(@PathVariable Long usuarioId, @PathVariable Long peliculaId,
            @RequestParam String profileName) {
        return service.verificarEnLista(usuarioId, peliculaId, profileName);
    }

    @PostMapping("/{usuarioId}/{peliculaId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void agregar(@PathVariable Long usuarioId, @PathVariable Long peliculaId, @RequestParam String profileName) {
        service.agregarPelicula(usuarioId, peliculaId, profileName);
    }

    @DeleteMapping("/{usuarioId}/{peliculaId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void quitar(@PathVariable Long usuarioId, @PathVariable Long peliculaId, @RequestParam String profileName) {
        service.quitarPelicula(usuarioId, peliculaId, profileName);
    }
}
