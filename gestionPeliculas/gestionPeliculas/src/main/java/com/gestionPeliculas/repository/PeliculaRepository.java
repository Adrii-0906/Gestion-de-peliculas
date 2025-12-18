package com.gestionPeliculas.repository;

import com.gestionPeliculas.domain.Pelicula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Repository
public interface PeliculaRepository extends JpaRepository<Pelicula, Long>, JpaSpecificationExecutor<Pelicula> {
    boolean existsByTituloIgnoreCase(String titulo);
}
