package com.gestionPeliculas.service;

import com.gestionPeliculas.DTOs.IdiomaCreateUpdateDTO;
import com.gestionPeliculas.DTOs.IdiomaDTO;
import com.gestionPeliculas.DTOs.mappers.IdiomaMapper;
import com.gestionPeliculas.domain.Idioma;
import com.gestionPeliculas.repository.IdiomaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class IdiomaService {

    @Autowired
    private IdiomaRepository idiomaRepository;

    @Autowired
    private IdiomaMapper idiomaMapper;

    public List<IdiomaDTO> listar() {
        return idiomaRepository.findAll()
                .stream()
                .map(idiomaMapper::toDto)
                .toList();
    }

    public IdiomaDTO buscarPorId(Long id) {
        Idioma idioma = idiomaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Idioma no encontrado con id: " + id));
        return idiomaMapper.toDto(idioma);
    }

    @Transactional
    public IdiomaDTO agregar(IdiomaCreateUpdateDTO dto) {
        Idioma idioma = idiomaMapper.toEntity(dto);
        idioma = idiomaRepository.save(idioma);
        return idiomaMapper.toDto(idioma);
    }

    @Transactional
    public IdiomaDTO actualizar(Long id, IdiomaCreateUpdateDTO dto) {
        Idioma idiomaExistente = idiomaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Idioma no encontrado con id: " + id));

        idiomaMapper.updateEntity(dto, idiomaExistente);
        Idioma actualizado = idiomaRepository.save(idiomaExistente);
        return idiomaMapper.toDto(actualizado);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!idiomaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Idioma no encontrado con id: " + id);
        }
        idiomaRepository.deleteById(id);
    }
}
