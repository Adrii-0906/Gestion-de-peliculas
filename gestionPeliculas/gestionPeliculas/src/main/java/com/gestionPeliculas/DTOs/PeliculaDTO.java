package com.gestionPeliculas.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeliculaDTO {

    private long id;
    private String titulo;
    private Integer duracion; // <--- 3ª Posición: Integer
    private LocalDate fechaEstreno;
    private String sinopsis;
    private Integer valoracion;
    private Integer edadMinima;
    private String imagenUrl; // <--- 7ª Posición: String

    // Tus DTOs completos
    private DirectorDTO director;
    private List<ActorDTO> actores;
    private List<CategoriaDTO> categorias;
    private List<IdiomaDTO> idiomas;
    private List<PlataformaDTO> plataformas;
}