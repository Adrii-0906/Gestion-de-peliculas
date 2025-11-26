package com.gestionPeliculas.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "critica")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Critica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "comentario")
    private String comentario;

    @Column(name = "nota")
    private double nota;

    @Column(name = "fecha")
    private LocalDate fecha;
}
