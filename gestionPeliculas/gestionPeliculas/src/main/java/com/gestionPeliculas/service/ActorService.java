package com.gestionPeliculas.service;

import com.gestionPeliculas.DTOs.ActorCreateUpdateDTO;
import com.gestionPeliculas.DTOs.ActorDTO;
import com.gestionPeliculas.DTOs.mappers.ActorMapper;
import com.gestionPeliculas.domain.Actor;
import com.gestionPeliculas.repository.ActorRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ActorService {

    @Autowired
    private ActorRepository actorRepository;

    @Autowired
    private ActorMapper actorMapper;

    public List<ActorDTO> listar() {
        return actorRepository.findAll()
                .stream()
                .map(actorMapper::toDto)
                .toList();
    }

    public ActorDTO buscarPorId(Long id) {
        Actor actor = actorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Actor no encontrado con id: " + id));
        return actorMapper.toDto(actor);
    }

    @Transactional
    public ActorDTO anadirActor(ActorCreateUpdateDTO dto) {
        Actor actor = actorMapper.toEntity(dto);
        actor = actorRepository.save(actor);
        return actorMapper.toDto(actor);
    }

    @Transactional
    public ActorDTO actualizar(Long id, ActorCreateUpdateDTO dto) {
        Actor actorExistente = actorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Actor no encontrado con id: " + id));

        actorMapper.updateEntity(dto, actorExistente);
        Actor actualizado = actorRepository.save(actorExistente);
        return actorMapper.toDto(actualizado);
    }

    @Transactional
    public void eliminar(Long id) {
        boolean existe = actorRepository.existsById(id);
        if (!existe) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Actor no encontrado con id: " + id);
        }
        actorRepository.deleteById(id);
    }
}
