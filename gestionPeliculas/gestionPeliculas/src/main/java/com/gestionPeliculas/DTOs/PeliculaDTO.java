package com.gestionPeliculas.DTOs;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeliculaDTO {

    private long id;
    private String titulo;
    private Integer duracion;
    private LocalDate fechaEstreno;
    private String sinopsis;
    private Integer valoracion;
}
