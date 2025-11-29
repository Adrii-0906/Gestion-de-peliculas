package com.gestionPeliculas.DTOs;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DirectorCreateUpdateDTO {
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
}
