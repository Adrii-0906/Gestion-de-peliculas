package com.gestionPeliculas.service;

import com.gestionPeliculas.DTOs.CategoriaCreateUpdateDTO;
import com.gestionPeliculas.DTOs.CategoriaDTO;
import com.gestionPeliculas.DTOs.mappers.CategoriaMapper;
import com.gestionPeliculas.domain.Categoria;
import com.gestionPeliculas.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private CategoriaMapper categoriaMapper;

    public List<CategoriaDTO> listar() {
        return categoriaRepository.findAll()
                .stream()
                .map(categoriaMapper::toDto)
                .toList();
    }

    public CategoriaDTO buscarPorId(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada con id: " + id));
        return categoriaMapper.toDto(categoria);
    }

    @Transactional
    public CategoriaDTO agregar(CategoriaCreateUpdateDTO dto) {
        Categoria categoria = categoriaMapper.toEntity(dto);
        categoria = categoriaRepository.save(categoria);
        return categoriaMapper.toDto(categoria);
    }

    @Transactional
    public CategoriaDTO actualizar(Long id, CategoriaCreateUpdateDTO dto) {
        Categoria categoriaExistente = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada con id: " + id));

        categoriaMapper.updateEntity(dto, categoriaExistente);
        Categoria actualizado = categoriaRepository.save(categoriaExistente);
        return categoriaMapper.toDto(actualizado);
    }

    @Transactional
    public void eliminar(Long id) {
        boolean existe = categoriaRepository.existsById(id);
        if (!existe) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada con id: " + id);
        }
        categoriaRepository.deleteById(id);
    }
}
