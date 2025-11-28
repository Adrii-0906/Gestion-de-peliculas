package com.gestionPeliculas.DTOs.mappers;

import com.gestionPeliculas.DTOs.ActorCreateUpdateDTO;
import com.gestionPeliculas.DTOs.ActorDTO;
import com.gestionPeliculas.domain.Actor;
import org.springframework.stereotype.Component;

@Component
public class ActorMapper {

    public ActorDTO toDto(Actor actor) {
        if (actor == null) {
            return null;
        }
        return new ActorDTO(
                actor.getId(),
                actor.getNombre()
        );
    }

    public Actor toEntity(ActorCreateUpdateDTO dto) {
        if (dto == null) {
            return null;
        }
        Actor actor = new Actor();
        actor.setNombre(dto.getNombre());
        return actor;
    }

    public void updateEntity(ActorCreateUpdateDTO dto, Actor actor) {
        if (dto == null || actor == null) {
            return;
        }
        actor.setNombre(dto.getNombre());
    }
}
