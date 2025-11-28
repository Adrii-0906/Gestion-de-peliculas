package com.gestionPeliculas.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SalaCreateUpdateDTO {
    @NotBlank(message = "El numero de sala es obligatorio")
    private Integer numeroSala;

    @NotBlank(message = "La capacidad es obligatorio")
    @Positive(message = "La capadidad tiene que ser mayor que 0")
    private Integer capacidad;


}
