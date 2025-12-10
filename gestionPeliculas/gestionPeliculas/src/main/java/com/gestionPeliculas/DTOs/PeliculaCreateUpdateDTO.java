package com.gestionPeliculas.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeliculaCreateUpdateDTO {

    @NotBlank(message = "El título es obligatorio")
    private String titulo;

    @NotBlank(message = "La URL de la imagen es obligatoria")
    private String imagenUrl;

    @NotNull(message = "La duración es obligatoria")
    private Integer duracion;

    @NotNull(message = "La fecha de estreno es obligatoria")
    private LocalDate fechaEstreno;

    @NotBlank(message = "La sinopsis es obligatoria")
    private String sinopsis;

    @NotNull(message = "La valoración es obligatoria")
    private Integer valoracion;

    // --- CAMBIO CLAVE: AHORA RECIBIMOS NOMBRES ---
    private String nombreDirector;       // Antes era Long directorId
    private List<String> nombresActores; // Antes era List<Long> actoresIds

    // (Opcional) Puedes dejar categorías e idiomas como IDs o quitarlos si no los usas ahora
    private List<Long> categoriasIds;
    private List<Long> idiomasIds;
    private List<Long> plataformasIds;
}