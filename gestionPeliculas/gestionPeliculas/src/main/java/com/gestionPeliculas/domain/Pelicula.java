package com.gestionPeliculas.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "peliculas")
@Data // ✅ Lombok genera getters, setters, toString, equals, hashCode
@AllArgsConstructor // ✅ genera constructor con todos los campos
@NoArgsConstructor
public class Pelicula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String titulo;

    @Column(length = 500) // 500 caracteres por si la URL es larga
    private String imagenUrl;

    private Integer duracion; // minutos

    @Column(name = "fecha_estreno")
    private LocalDate fechaEstreno;

    @Column(length = 2000)
    private String sinopsis;

    private Integer valoracion;

    // Relacion con director
    @ManyToOne
    @JoinColumn(name = "director_id")
    private Director director;

    // Relacion con actor
    @ManyToMany
    @JoinTable(name = "peliculas_actores", // nombre de la tabla intermedia
            joinColumns = @JoinColumn(name = "pelicula_id"), // FK de esta entidad
            inverseJoinColumns = @JoinColumn(name = "actor_id") // FK de la otra entidad
    )
    private List<Actor> actores = new ArrayList<>();

    // Relacion con funcion
    @OneToMany(mappedBy = "pelicula")
    @JsonIgnore
    private List<Funcion> funciones = new ArrayList<>();

    // Relacion con critica
    @OneToMany(mappedBy = "pelicula")
    @JsonIgnore
    private List<Critica> criticas = new ArrayList<>();

    // Relacion con plataforma
    @ManyToMany
    @JoinTable(name = "peliculas_plataformas", joinColumns = @JoinColumn(name = "pelicula_id"), inverseJoinColumns = @JoinColumn(name = "plataforma_id"))
    @JsonIgnore
    private List<Plataforma> plataformas = new ArrayList<>();

    // Relacion con categoria
    @ManyToMany
    @JoinTable(name = "peliculas_categorias", joinColumns = @JoinColumn(name = "pelicula_id"), inverseJoinColumns = @JoinColumn(name = "categoria_id"))
    private List<Categoria> categorias = new ArrayList<>();

    // Relacion con idioma
    @ManyToMany
    @JoinTable(name = "peliculas_idiomas", joinColumns = @JoinColumn(name = "pelicula_id"), inverseJoinColumns = @JoinColumn(name = "idioma_id"))
    private List<Idioma> idiomas = new ArrayList<>();

    // Mantener sincronizada una relación bidireccional Actor <-> Pelicula
    public void addActor(Actor a) {
        if (!actores.contains(a)) {
            actores.add(a);
        }
        if (!a.getPeliculas().contains(this)) {
            a.getPeliculas().add(this);
        }
    }

}
