package com.gestionPeliculas.DTOs;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlataformaCreateUpdateDTO {
    @NotBlank(message = "El nombre de la plataforma es obligatorio")
    private String nombre;

    @NotBlank(message = "La url de la plataforma es obligatoria")
    private String url;
}
