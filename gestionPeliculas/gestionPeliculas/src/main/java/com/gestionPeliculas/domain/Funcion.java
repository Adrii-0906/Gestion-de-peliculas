package com.gestionPeliculas.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "funcion")
@Data
@NoArgsConstructor
public class Funcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha")
    private LocalDate fecha;

    @Column(name = "hora")
    private LocalTime hora;

    @Column(name = "precio")
    private Double precio;

    @Column(name = "formato")
    private String formato;

    // Relacion con sala
    @ManyToOne
    @JoinColumn(name = "id_sala")
    private Sala sala;

    // Relacion con pelicula
    @ManyToOne
    @JoinColumn(name = "pelicula")
    private Pelicula pelicula;


}
