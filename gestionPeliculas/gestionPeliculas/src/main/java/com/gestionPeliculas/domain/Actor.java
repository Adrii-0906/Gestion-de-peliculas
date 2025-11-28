package com.gestionPeliculas.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "actor")
@Data  // ✅ Lombok genera getters, setters, toString, equals, hashCode
@NoArgsConstructor
public class Actor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @ManyToMany(mappedBy = "actores")
    @JsonIgnore
    private List<Pelicula> peliculas = new ArrayList<>();

    public void addPelicula(Pelicula pelicula){
        peliculas.add(pelicula);
        pelicula.getActores().add(this);
    }
}