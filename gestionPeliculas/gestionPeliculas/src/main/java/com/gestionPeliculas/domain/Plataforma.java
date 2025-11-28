package com.gestionPeliculas.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "plataforma")
@Data
@NoArgsConstructor
public class Plataforma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "url")
    private String url;

    @ManyToMany(mappedBy = "plataformas")
    @JsonIgnore
    private List<Pelicula> peliculas = new ArrayList<>();
}
