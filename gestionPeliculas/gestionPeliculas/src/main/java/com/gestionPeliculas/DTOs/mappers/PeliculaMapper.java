package com.gestionPeliculas.DTOs.mappers;

import com.gestionPeliculas.DTOs.PeliculaCreateUpdateDTO;
import com.gestionPeliculas.DTOs.PeliculaDTO;
import com.gestionPeliculas.domain.Pelicula;
import org.springframework.stereotype.Component;

@Component
public class PeliculaMapper {

    public PeliculaDTO toDto(Pelicula pelicula) {
        if (pelicula == null) return null;
        return new PeliculaDTO(
                pelicula.getId(),
                pelicula.getTitulo(),
                pelicula.getImagenUrl(),
                pelicula.getDuracion(),
                pelicula.getFechaEstreno(),
                pelicula.getSinopsis(),
                pelicula.getValoracion()
        );
    }

    public Pelicula toEntity(PeliculaCreateUpdateDTO peliculaCreateUpdateDTO) {
        if (peliculaCreateUpdateDTO == null) return null;
        Pelicula pelicula = new Pelicula();
        pelicula.setTitulo(peliculaCreateUpdateDTO.getTitulo());
        pelicula.setImagenUrl(peliculaCreateUpdateDTO.getImagenUrl());
        pelicula.setDuracion(peliculaCreateUpdateDTO.getDuracion());
        pelicula.setFechaEstreno(peliculaCreateUpdateDTO.getFechaEstreno());
        pelicula.setSinopsis(peliculaCreateUpdateDTO.getSinopsis());
        pelicula.setValoracion(peliculaCreateUpdateDTO.getValoracion());
        return pelicula;
    }

    public void updateEntity(PeliculaCreateUpdateDTO peliculaCreateUpdateDTO, Pelicula pelicula) {
        if (peliculaCreateUpdateDTO == null || pelicula == null) return;

        pelicula.setTitulo(peliculaCreateUpdateDTO.getTitulo());
        pelicula.setImagenUrl(peliculaCreateUpdateDTO.getImagenUrl());
        pelicula.setDuracion(peliculaCreateUpdateDTO.getDuracion());
        pelicula.setFechaEstreno(peliculaCreateUpdateDTO.getFechaEstreno());
        pelicula.setSinopsis(peliculaCreateUpdateDTO.getSinopsis());
        pelicula.setValoracion(peliculaCreateUpdateDTO.getValoracion());
    }
}
