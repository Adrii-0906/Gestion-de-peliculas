package com.gestionPeliculas.DTOs;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IdiomaCreateUpdateDTO {

    @NotBlank(message = "El nombre del idioma no puede esta vacio")
    private String nombre;
}
