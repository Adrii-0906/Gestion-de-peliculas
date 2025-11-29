package com.gestionPeliculas.DTOs.mappers;

import com.gestionPeliculas.DTOs.DirectorCreateUpdateDTO;
import com.gestionPeliculas.DTOs.DirectorDTO;
import com.gestionPeliculas.domain.Director;
import org.springframework.stereotype.Component;

@Component
public class DirectorMapper {

    public DirectorDTO toDto(Director director) {
        if (director == null) return null;
        return new DirectorDTO(
                director.getId(),
                director.getNombre()
        );
    }

    public Director toEntity(DirectorCreateUpdateDTO dto) {
        if (dto == null) return null;
        Director director = new Director();
        director.setNombre(dto.getNombre());
        return director;
    }

    public void updateEntity(DirectorCreateUpdateDTO dto, Director director) {
        if (dto == null || director == null) return;
        director.setNombre(dto.getNombre());
    }
}
