package com.gestionPeliculas.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "sala")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Sala {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "numero_sala")
    private int numeroSala;

    @Column(name = "capacidad")
    private int capacidad;

    @OneToMany(mappedBy = "sala")
    @JsonIgnore
    private List<Funcion> funciones;
}
