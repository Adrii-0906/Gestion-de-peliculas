package com.gestionPeliculas.DTOs.mappers;

import com.gestionPeliculas.DTOs.UsuarioCreateUpdateDTO;
import com.gestionPeliculas.DTOs.UsuarioDTO;
import com.gestionPeliculas.domain.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public UsuarioDTO toDto(Usuario usuario) {
        if (usuario == null)
            return null;
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getUsername(),
                usuario.getEmail(),
                usuario.getPassword(),
                usuario.getAvatar(),
                usuario.getRol() != null ? usuario.getRol().toString() : "USER",
                usuario.getActivo() != null ? usuario.getActivo() : true);
    }

    public Usuario toEntity(UsuarioCreateUpdateDTO dto) {
        if (dto == null)
            return null;
        Usuario usuario = new Usuario();
        usuario.setUsername(dto.getUsername());
        usuario.setEmail(dto.getEmail());
        usuario.setPassword(dto.getPassword());
        usuario.setAvatar(dto.getAvatar());
        usuario.setRol(com.gestionPeliculas.domain.Rol.USUARIO);
        usuario.setActivo(true);
        return usuario;
    }

    public void updateEntity(UsuarioCreateUpdateDTO dto, Usuario usuario) {
        if (dto == null || usuario == null)
            return;
        usuario.setUsername(dto.getUsername());
        usuario.setEmail(dto.getEmail());
        usuario.setPassword(dto.getPassword());
        usuario.setAvatar(dto.getAvatar());
    }
}
