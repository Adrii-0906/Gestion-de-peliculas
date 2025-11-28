package com.gestionPeliculas.repository;

import com.gestionPeliculas.domain.Critica;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CriticaRepository extends JpaRepository<Critica, Long> {
}
