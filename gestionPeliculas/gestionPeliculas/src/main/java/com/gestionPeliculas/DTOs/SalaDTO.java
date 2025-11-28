package com.gestionPeliculas.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SalaDTO {
    private Long id;
    private Integer numeroSala;
    private Integer capacidad;
}
