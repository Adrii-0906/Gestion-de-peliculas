package com.gestionPeliculas.repository;

import com.gestionPeliculas.domain.Plataforma;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlataformaRepository extends JpaRepository<Plataforma, Long> {
}
