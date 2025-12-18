package com.gestionPeliculas.service;

import com.gestionPeliculas.domain.ListaItem;
import com.gestionPeliculas.domain.Pelicula;
import com.gestionPeliculas.domain.Usuario;
import com.gestionPeliculas.repository.ListaItemRepository;
import com.gestionPeliculas.repository.PeliculaRepository;
import com.gestionPeliculas.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListaService {

    private final ListaItemRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final PeliculaRepository peliculaRepository;

    public List<ListaItem> obtenerLista(Long usuarioId, String profileName) {
        return repository.findByUsuarioIdAndProfileName(usuarioId, profileName);
    }

    public boolean verificarEnLista(Long usuarioId, Long peliculaId, String profileName) {
        return repository.existsByUsuarioIdAndPeliculaIdAndProfileName(usuarioId, peliculaId, profileName);
    }

    @Transactional
    public void agregarPelicula(Long usuarioId, Long peliculaId, String profileName) {
        if (verificarEnLista(usuarioId, peliculaId, profileName)) {
            return; // Ya está en la lista de este perfil
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        Pelicula pelicula = peliculaRepository.findById(peliculaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Película no encontrada"));

        ListaItem item = new ListaItem();
        item.setUsuario(usuario);
        item.setPelicula(pelicula);
        item.setProfileName(profileName);

        repository.save(item);
    }

    @Transactional
    public void quitarPelicula(Long usuarioId, Long peliculaId, String profileName) {
        repository.deleteByUsuarioIdAndPeliculaIdAndProfileName(usuarioId, peliculaId, profileName);
    }
}
