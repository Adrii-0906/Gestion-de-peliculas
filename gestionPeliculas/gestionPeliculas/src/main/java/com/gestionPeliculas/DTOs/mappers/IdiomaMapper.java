package com.gestionPeliculas.DTOs.mappers;

import com.gestionPeliculas.DTOs.IdiomaCreateUpdateDTO;
import com.gestionPeliculas.DTOs.IdiomaDTO;
import com.gestionPeliculas.domain.Idioma;
import org.springframework.stereotype.Component;

@Component
public class IdiomaMapper {

    public IdiomaDTO toDto(Idioma idioma) {
        if (idioma == null) {
            return null;
        }
        return new IdiomaDTO(
                idioma.getId(),
                idioma.getNombre()
        );
    }

    public Idioma toEntity(IdiomaCreateUpdateDTO dto) {
        if (dto == null) {
            return null;
        }
        Idioma idioma = new Idioma();
        idioma.setNombre(dto.getNombre());
        return idioma;
    }

    public void updateEntity(IdiomaCreateUpdateDTO dto, Idioma idioma) {
        if (dto == null || idioma == null) {
            return;
        }

        idioma.setNombre(dto.getNombre());
    }
}
