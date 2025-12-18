package com.gestionPeliculas.repository;

import com.gestionPeliculas.domain.ListaItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ListaItemRepository extends JpaRepository<ListaItem, Long> {
    List<ListaItem> findByUsuarioId(Long usuarioId);

    List<ListaItem> findByUsuarioIdAndProfileName(Long usuarioId, String profileName);

    Optional<ListaItem> findByUsuarioIdAndPeliculaId(Long usuarioId, Long peliculaId);

    boolean existsByUsuarioIdAndPeliculaId(Long usuarioId, Long peliculaId);

    boolean existsByUsuarioIdAndPeliculaIdAndProfileName(Long usuarioId, Long peliculaId, String profileName);

    void deleteByUsuarioIdAndPeliculaId(Long usuarioId, Long peliculaId);

    void deleteByUsuarioIdAndPeliculaIdAndProfileName(Long usuarioId, Long peliculaId, String profileName);
}
