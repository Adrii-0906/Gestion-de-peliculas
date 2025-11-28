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
@NoArgsConstructor
public class Sala {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_sala")
    private Integer numeroSala;

    @Column(name = "capacidad")
    private Integer capacidad;

    // Relacion con funcion
    @OneToMany(mappedBy = "sala")
    @JsonIgnore
    private List<Funcion> funciones;
}
