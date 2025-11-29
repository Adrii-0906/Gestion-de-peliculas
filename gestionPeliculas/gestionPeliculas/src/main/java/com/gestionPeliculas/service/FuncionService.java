package com.gestionPeliculas.service;

import com.gestionPeliculas.DTOs.FuncionCreateUpdateDTO;
import com.gestionPeliculas.DTOs.FuncionDTO;
import com.gestionPeliculas.DTOs.mappers.FuncionMapper;
import com.gestionPeliculas.domain.Funcion;
import com.gestionPeliculas.repository.FuncionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FuncionService {

    private final FuncionRepository funcionRepository;
    private final FuncionMapper funcionMapper;

    public List<FuncionDTO> listar() {
        return funcionRepository.findAll()
                .stream()
                .map(funcionMapper::toDto)
                .toList();
    }

    public FuncionDTO buscarPorId(Long id) {
        Funcion funcion = funcionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Función no encontrada"));
        return funcionMapper.toDto(funcion);
    }

    public FuncionDTO agregar(FuncionCreateUpdateDTO dto) {
        Funcion funcion = funcionMapper.toEntity(dto);
        funcion = funcionRepository.save(funcion);
        return funcionMapper.toDto(funcion);
    }

    public FuncionDTO actualizar(Long id, FuncionCreateUpdateDTO dto) {
        Funcion existente = funcionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Función no encontrada"));

        funcionMapper.updateEntity(dto, existente);
        existente = funcionRepository.save(existente);

        return funcionMapper.toDto(existente);
    }

    public void eliminar(Long id) {
        if (!funcionRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Función no encontrada");
        }
        funcionRepository.deleteById(id);
    }


}
