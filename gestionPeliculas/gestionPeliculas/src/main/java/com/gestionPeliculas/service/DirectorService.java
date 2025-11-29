package com.gestionPeliculas.service;

import com.gestionPeliculas.DTOs.DirectorCreateUpdateDTO;
import com.gestionPeliculas.DTOs.DirectorDTO;
import com.gestionPeliculas.DTOs.mappers.DirectorMapper;
import com.gestionPeliculas.domain.Director;
import com.gestionPeliculas.repository.DirectorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Component
public class DirectorService {
    @Autowired
    private DirectorRepository directorRepository;

    @Autowired
    private DirectorMapper directorMapper;

    public List<DirectorDTO> listar() {
        return directorRepository.findAll()
                .stream()
                .map(directorMapper::toDto)
                .toList();
    }

    public DirectorDTO buscarPorId(Long id) {
        Director director = directorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Director no encontrado con id: " + id));
        return directorMapper.toDto(director);
    }

    @Transactional
    public DirectorDTO agregar(DirectorCreateUpdateDTO dto) {
        Director director = directorMapper.toEntity(dto);
        director = directorRepository.save(director);
        return directorMapper.toDto(director);
    }

    @Transactional
    public DirectorDTO actualizar(Long id, DirectorCreateUpdateDTO dto) {
        Director directorExistente = directorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Director no encontrado con id: " + id));

        directorMapper.updateEntity(dto, directorExistente);
        Director actualizado = directorRepository.save(directorExistente);
        return directorMapper.toDto(actualizado);
    }

    @Transactional
    public void eliminar(Long id) {
        boolean existe = directorRepository.existsById(id);
        if (!existe) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Director no encontrado con id: " + id);
        }
        directorRepository.deleteById(id);
    }
}

