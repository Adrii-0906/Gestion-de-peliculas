package com.gestionPeliculas.DTOs.mappers;

import com.gestionPeliculas.DTOs.ActorCreateUpdateDTO;
import com.gestionPeliculas.DTOs.ActorDTO;
import com.gestionPeliculas.DTOs.CriticaCreateUpdateDTO;
import com.gestionPeliculas.DTOs.CriticaDTO;
import com.gestionPeliculas.domain.Actor;
import com.gestionPeliculas.domain.Critica;
import org.springframework.stereotype.Component;

@Component
public class CriticaMapper {

    public CriticaDTO toDto(Critica critica) {
        if (critica == null) return null;
        CriticaDTO dto = new CriticaDTO();
        dto.setId(critica.getId());
        dto.setComentario(critica.getComentario());
        dto.setNota(critica.getNota());
        dto.setFecha(critica.getFecha());
        return dto;
    }

    public Critica toEntity(CriticaCreateUpdateDTO dto) {
        if (dto == null) return null;
        Critica critica = new Critica();
        critica.setComentario(dto.getComentario());
        critica.setNota(dto.getNota());
        critica.setFecha(dto.getFecha());
        return critica;
    }

    public void updateEntity(CriticaCreateUpdateDTO dto, Critica critica) {
        if (dto == null || critica == null) return;
        critica.setComentario(dto.getComentario());
        critica.setNota(dto.getNota());
        critica.setFecha(dto.getFecha());
    }

}
