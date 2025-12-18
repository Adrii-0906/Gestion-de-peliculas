package com.gestionPeliculas.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "lista_item", uniqueConstraints = {
                @UniqueConstraint(columnNames = { "usuario_id", "pelicula_id", "profile_name" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListaItem {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name = "usuario_id", nullable = false)
        @com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "criticas", "password" })
        private Usuario usuario;

        @ManyToOne
        @JoinColumn(name = "pelicula_id", nullable = false)
        @com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "criticas", "actores", "idiomas", "plataformas",
                        "director", "categorias", "funciones" })
        private Pelicula pelicula;

        @Column(name = "profile_name", nullable = false)
        private String profileName;

        @Column(name = "fecha_agregado")
        private LocalDateTime fechaAgregado = LocalDateTime.now();
}
