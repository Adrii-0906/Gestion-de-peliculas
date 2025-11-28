package com.gestionPeliculas.DTOs.mappers;

import com.gestionPeliculas.DTOs.PlataformaCreateUpdateDTO;
import com.gestionPeliculas.DTOs.PlataformaDTO;
import com.gestionPeliculas.domain.Plataforma;
import org.springframework.stereotype.Component;

@Component
public class PlataformaMapper {

    public PlataformaDTO toDto(Plataforma plataforma) {
        if (plataforma == null) {
            return null;
        }
        return new PlataformaDTO(
                plataforma.getId(),
                plataforma.getNombre(),
                plataforma.getUrl()
        );
    }

    public Plataforma toEntity(PlataformaCreateUpdateDTO dto) {
        if (dto == null) {
            return null;
        }
        Plataforma plataforma = new Plataforma();
        plataforma.setNombre(dto.getNombre());
        plataforma.setUrl(dto.getUrl());
        return plataforma;
    }

    public void updateEntity(PlataformaCreateUpdateDTO dto, Plataforma plataforma) {
        if (dto == null || plataforma == null) {
            return;
        }
        plataforma.setNombre(dto.getNombre());
        plataforma.setUrl(dto.getUrl());
    }
}
