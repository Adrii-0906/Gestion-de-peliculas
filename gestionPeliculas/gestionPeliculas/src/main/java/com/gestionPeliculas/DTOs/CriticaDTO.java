package com.gestionPeliculas.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CriticaDTO {
    private Long id;
    private String comentario;
    private Double nota;
    private LocalDate fecha;
}
