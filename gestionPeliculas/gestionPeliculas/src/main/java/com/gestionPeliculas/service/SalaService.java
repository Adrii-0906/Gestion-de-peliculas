package com.gestionPeliculas.service;

import com.gestionPeliculas.DTOs.SalaCreateUpdateDTO;
import com.gestionPeliculas.DTOs.SalaDTO;
import com.gestionPeliculas.DTOs.mappers.SalaMapper;
import com.gestionPeliculas.domain.Sala;
import com.gestionPeliculas.repository.SalaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class SalaService {

    @Autowired
    private SalaRepository salaRepository;

    @Autowired
    private SalaMapper salaMapper;

    public List<SalaDTO> listar() {
        return salaRepository.findAll()
                .stream()
                .map(salaMapper::toDto)
                .toList();
    }

    public SalaDTO buscarPorId(Long id) {
        Sala sala = salaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sala no encontrada con id: " + id));
        return salaMapper.toDto(sala);
    }

    @Transactional
    public SalaDTO agregar(SalaCreateUpdateDTO dto) {
        Sala sala = salaMapper.toEntity(dto);
        sala = salaRepository.save(sala);
        return salaMapper.toDto(sala);
    }

    @Transactional
    public SalaDTO actualizar(Long id, SalaCreateUpdateDTO dto) {
        Sala existente = salaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sala no encontrada con id: " + id));

        salaMapper.entityUpdate(dto, existente);
        existente = salaRepository.save(existente);

        return salaMapper.toDto(existente);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!salaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sala no encontrada con id: " + id);
        }
        salaRepository.deleteById(id);
    }
}
