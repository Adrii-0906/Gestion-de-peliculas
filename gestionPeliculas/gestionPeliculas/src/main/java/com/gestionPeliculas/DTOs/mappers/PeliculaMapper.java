package com.gestionPeliculas.DTOs.mappers;

import com.gestionPeliculas.DTOs.*;
import com.gestionPeliculas.domain.Pelicula;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.stream.Collectors;

@Component
public class PeliculaMapper {

    // 1. De Entidad a DTO (Para LEER/MOSTRAR en React)
    public PeliculaDTO toDto(Pelicula entity) {
        if (entity == null) return null;

        // Preparamos el DirectorDTO para evitar errores si es null
        DirectorDTO directorDto = null;
        if (entity.getDirector() != null) {
            directorDto = new DirectorDTO(entity.getDirector().getId(), entity.getDirector().getNombre());
        }

        return new PeliculaDTO(
                entity.getId(),
                entity.getTitulo(),
                entity.getDuracion(),
                entity.getFechaEstreno(),
                entity.getSinopsis(),
                entity.getValoracion(),
                entity.getImagenUrl(), // ✅ Posición correcta según tu DTO

                directorDto, // Objeto DirectorDTO

                // Listas mapeadas con Streams
                entity.getActores() == null ? Collections.emptyList() :
                        entity.getActores().stream()
                                .map(a -> new ActorDTO(a.getId(), a.getNombre()))
                                .collect(Collectors.toList()),

                entity.getCategorias() == null ? Collections.emptyList() :
                        entity.getCategorias().stream()
                                .map(c -> new CategoriaDTO(c.getId(), c.getNombre()))
                                .collect(Collectors.toList()),

                entity.getIdiomas() == null ? Collections.emptyList() :
                        entity.getIdiomas().stream()
                                .map(i -> new IdiomaDTO(i.getId(), i.getNombre()))
                                .collect(Collectors.toList()),

                entity.getPlataformas() == null ? Collections.emptyList() :
                        entity.getPlataformas().stream()
                                .map(p -> new PlataformaDTO(p.getId(), p.getNombre(), p.getUrl()))
                                .collect(Collectors.toList())
        );
    }

    // 2. De DTO a Entidad (Para CREAR una película nueva)
    public Pelicula toEntity(PeliculaCreateUpdateDTO dto) {
        if (dto == null) return null;

        Pelicula pelicula = new Pelicula();
        pelicula.setTitulo(dto.getTitulo());
        pelicula.setDuracion(dto.getDuracion());
        pelicula.setFechaEstreno(dto.getFechaEstreno());
        pelicula.setSinopsis(dto.getSinopsis());
        pelicula.setValoracion(dto.getValoracion());
        pelicula.setImagenUrl(dto.getImagenUrl());

        // NOTA: Aquí solo mapeamos los campos básicos.
        // Las relaciones (Director, Actores, etc.) se suelen asignar en el Service
        // porque hace falta buscar las entidades por ID en la base de datos.

        return pelicula;
    }

    // 3. Actualizar Entidad existente (Para EDITAR)
    public void updateEntity(PeliculaCreateUpdateDTO dto, Pelicula pelicula) {
        if (dto == null || pelicula == null) return;

        pelicula.setTitulo(dto.getTitulo());
        pelicula.setDuracion(dto.getDuracion());
        pelicula.setFechaEstreno(dto.getFechaEstreno());
        pelicula.setSinopsis(dto.getSinopsis());
        pelicula.setValoracion(dto.getValoracion());
        pelicula.setImagenUrl(dto.getImagenUrl());

        // Igual que arriba: las relaciones se actualizan en el Service.
    }
}