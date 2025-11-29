package com.gestionPeliculas.service;


import com.gestionPeliculas.DTOs.PlataformaCreateUpdateDTO;
import com.gestionPeliculas.DTOs.PlataformaDTO;
import com.gestionPeliculas.DTOs.mappers.PlataformaMapper;
import com.gestionPeliculas.domain.Plataforma;
import com.gestionPeliculas.repository.PlataformaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PlataformaService {

    @Autowired
    private PlataformaRepository plataformaRepository;

    @Autowired
    private PlataformaMapper plataformaMapper;

    public List<PlataformaDTO> listar() {
        return plataformaRepository.findAll()
                .stream()
                .map(plataformaMapper::toDto)
                .toList();
    }

    public PlataformaDTO buscarPorId(Long id) {
        Plataforma plataforma = plataformaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plataforma no encontrada con id: " + id));
        return plataformaMapper.toDto(plataforma);
    }

    @Transactional
    public PlataformaDTO agregar(PlataformaCreateUpdateDTO dto) {
        Plataforma plataforma = plataformaMapper.toEntity(dto);
        plataforma = plataformaRepository.save(plataforma);
        return plataformaMapper.toDto(plataforma);
    }

    @Transactional
    public PlataformaDTO actualizar(Long id, PlataformaCreateUpdateDTO dto) {
        Plataforma existente = plataformaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plataforma no encontrada con id: " + id));

        plataformaMapper.updateEntity(dto, existente);
        Plataforma actualizado = plataformaRepository.save(existente);
        return plataformaMapper.toDto(actualizado);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!plataformaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Plataforma no encontrada con id: " + id);
        }
        plataformaRepository.deleteById(id);
    }
}
