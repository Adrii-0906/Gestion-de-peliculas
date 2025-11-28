package com.gestionPeliculas.DTOs.mappers;

import com.gestionPeliculas.DTOs.ActorCreateUpdateDTO;
import com.gestionPeliculas.DTOs.CategoriaCreateUpdateDTO;
import com.gestionPeliculas.DTOs.CategoriaDTO;
import com.gestionPeliculas.domain.Categoria;
import org.springframework.stereotype.Component;

@Component
public class CategoriaMapper {
    public CategoriaDTO toDto(Categoria categoria) {
        if (categoria == null) {
            return null;
        }
        return new CategoriaDTO(
                categoria.getId(),
                categoria.getNombre()
        );
    }

    public Categoria toEntity(CategoriaCreateUpdateDTO dto) {
        if (dto == null) {
            return null;
        }
        Categoria categoria = new Categoria();
        categoria.setNombre(dto.getNombre());
        return categoria;
    }

    public void updateEntity(CategoriaCreateUpdateDTO dto, Categoria categoria) {
        if (dto == null || categoria == null) {
            return;
        }
        categoria.setNombre(dto.getNombre());
    }
}
