package com.gestionPeliculas.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "critica")
@Data
@NoArgsConstructor
public class Critica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "comentario")
    private String comentario;

    @Column(name = "nota")
    private double nota;

    @Column(name = "fecha")
    private LocalDate fecha;

    // relacion con usuario
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    // Relacion con pelicula
    @ManyToOne
    @JoinColumn(name = "pelicula")
    private Pelicula pelicula;
}
