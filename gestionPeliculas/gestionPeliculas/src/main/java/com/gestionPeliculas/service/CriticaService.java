package com.gestionPeliculas.service;

import com.gestionPeliculas.DTOs.CriticaCreateUpdateDTO;
import com.gestionPeliculas.DTOs.CriticaDTO;
import com.gestionPeliculas.DTOs.mappers.CriticaMapper;
import com.gestionPeliculas.domain.Critica;
import com.gestionPeliculas.repository.CriticaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;


@Service
public class CriticaService {

    @Autowired
    private CriticaRepository criticaRepository;

    @Autowired
    private CriticaMapper criticaMapper;

    public List<CriticaDTO> listar() {
        return criticaRepository.findAll()
                .stream()
                .map(criticaMapper::toDto)
                .toList();

        /*return criticaRepository.findAll()
                .stream()
                .map(criticaMapper::toDto)
                .toList();

         */
    }

    public CriticaDTO buscarPorId(Long id) {
        Critica critica = criticaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Crítica no encontrada con id: " + id));
        return criticaMapper.toDto(critica);
    }

    @Transactional
    public CriticaDTO agregar(CriticaCreateUpdateDTO dto) {
        Critica critica = criticaMapper.toEntity(dto);
        critica = criticaRepository.save(critica);
        return criticaMapper.toDto(critica);
    }

    @Transactional
    public CriticaDTO actualizar(Long id, CriticaCreateUpdateDTO dto) {
        Critica criticaExistente = criticaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Crítica no encontrada con id: " + id));

        criticaMapper.updateEntity(dto, criticaExistente);
        Critica actualizado = criticaRepository.save(criticaExistente);
        return criticaMapper.toDto(actualizado);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!criticaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Crítica no encontrada con id: " + id);
        }
        criticaRepository.deleteById(id);
    }
}
