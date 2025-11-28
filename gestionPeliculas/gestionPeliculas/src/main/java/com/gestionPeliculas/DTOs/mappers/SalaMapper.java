package com.gestionPeliculas.DTOs.mappers;

import com.gestionPeliculas.DTOs.SalaCreateUpdateDTO;
import com.gestionPeliculas.DTOs.SalaDTO;
import com.gestionPeliculas.domain.Sala;
import org.springframework.stereotype.Component;

@Component
public class SalaMapper {

    public SalaDTO toDto(Sala sala) {
        if (sala == null) {
            return null;
        }
        return new SalaDTO(
                sala.getId(),
                sala.getNumeroSala(),
                sala.getCapacidad()
        );
    }

    public Sala toEntity(SalaCreateUpdateDTO dto) {
        if (dto == null) {
            return null;
        }
        Sala sala = new Sala();
        sala.setNumeroSala(dto.getNumeroSala());
        sala.setCapacidad(dto.getCapacidad());
        return sala;
    }

    public void entityUpdate(SalaCreateUpdateDTO dto, Sala sala) {
        if (dto == null || sala == null) {
            return;
        }
        sala.setNumeroSala(dto.getNumeroSala());
        sala.setCapacidad(dto.getCapacidad());
    }
}
