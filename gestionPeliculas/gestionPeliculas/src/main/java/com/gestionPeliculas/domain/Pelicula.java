package com.gestionPeliculas.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "peliculas")
@Data  // ✅ Lombok genera getters, setters, toString, equals, hashCode
@AllArgsConstructor      // ✅ genera constructor con todos los campos
@NoArgsConstructor
public class Pelicula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String titulo;

    private int duracion;              // minutos

    @Column(name = "fecha_estreno")
    private LocalDate fechaEstreno;

    private String sinopsis;

    private int valoracion;

    @OneToOne
    @JoinColumn(name = "ficha_id") // FK en la tabla Pelicula que apunta a FichaTecnica.
    private FichaTecnica fichaTecnica;

    @ManyToOne
    @JoinColumn(name = "director_id")
    @JsonManagedReference
    private Director director;

    @ManyToMany
    @JoinTable(
            name = "peliculas_actores",                             // nombre de la tabla intermedia
            joinColumns = @JoinColumn(name = "pelicula_id"),        // FK de esta entidad
            inverseJoinColumns = @JoinColumn(name = "actor_id")     // FK de la otra entidad
    )
    @JsonIgnore
    private List<Actor> actores;

    // Mantener sincronizada una relación bidireccional Actor <-> Pelicula
    public void addActor(Actor a){
        if (!actores.contains(a)) {
            actores.add(a);
        }
        if (!a.getPeliculas().contains(this)) {
            a.getPeliculas().add(this);
        }
    }

//    public void addActor(Actor actor){
//        actores.add(actor);
//        actor.getPeliculas().add(this);
//    }
}
