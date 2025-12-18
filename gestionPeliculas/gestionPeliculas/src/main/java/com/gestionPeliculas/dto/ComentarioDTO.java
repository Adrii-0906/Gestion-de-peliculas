package com.gestionPeliculas.dto;

import java.time.LocalDateTime;

public class ComentarioDTO {
    private Long id;
    private String texto;
    private LocalDateTime fecha;
    private Long usuarioId;
    private String username;
    private String avatar;
    private Long peliculaId;
    private String peliculaTitulo;

    public ComentarioDTO() {
    }

    public ComentarioDTO(Long id, String texto, LocalDateTime fecha, Long usuarioId, String username, String avatar,
            Long peliculaId, String peliculaTitulo) {
        this.id = id;
        this.texto = texto;
        this.fecha = fecha;
        this.usuarioId = usuarioId;
        this.username = username;
        this.avatar = avatar;
        this.peliculaId = peliculaId;
        this.peliculaTitulo = peliculaTitulo;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public Long getPeliculaId() {
        return peliculaId;
    }

    public void setPeliculaId(Long peliculaId) {
        this.peliculaId = peliculaId;
    }

    public String getPeliculaTitulo() {
        return peliculaTitulo;
    }

    public void setPeliculaTitulo(String peliculaTitulo) {
        this.peliculaTitulo = peliculaTitulo;
    }
}
