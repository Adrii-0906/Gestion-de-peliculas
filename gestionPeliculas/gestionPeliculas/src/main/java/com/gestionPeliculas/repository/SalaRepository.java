package com.gestionPeliculas.repository;

import com.gestionPeliculas.domain.Sala;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalaRepository extends JpaRepository<Sala, Long> {
}
