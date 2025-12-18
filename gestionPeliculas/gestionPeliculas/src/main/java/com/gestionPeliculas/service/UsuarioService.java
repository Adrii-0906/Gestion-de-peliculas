package com.gestionPeliculas.service;

import com.gestionPeliculas.DTOs.UsuarioCreateUpdateDTO;
import com.gestionPeliculas.DTOs.UsuarioDTO;
import com.gestionPeliculas.DTOs.mappers.UsuarioMapper;
import com.gestionPeliculas.domain.Usuario;
import com.gestionPeliculas.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.Collections;

import java.util.List;

@Service
public class UsuarioService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioMapper usuarioMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UsuarioDTO> listar() {
        return usuarioRepository.findAll()
                .stream()
                .map(usuarioMapper::toDto)
                .toList();
    }

    public UsuarioDTO buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado con id: " + id));
        return usuarioMapper.toDto(usuario);
    }

    @Transactional
    public UsuarioDTO agregar(UsuarioCreateUpdateDTO dto) {
        // Verificar si el email ya existe
        if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El email ya está registrado");
        }

        Usuario usuario = usuarioMapper.toEntity(dto);
        // Encriptar contraseña antes de guardar
        usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        usuario = usuarioRepository.save(usuario);
        return usuarioMapper.toDto(usuario);
    }

    @Transactional
    public UsuarioDTO actualizar(Long id, UsuarioCreateUpdateDTO dto) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado con id: " + id));

        usuarioMapper.updateEntity(dto, usuarioExistente);

        // Si se proporciona una nueva contraseña, encriptarla
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            usuarioExistente.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        Usuario actualizado = usuarioRepository.save(usuarioExistente);
        return usuarioMapper.toDto(actualizado);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado con id: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public UsuarioDTO login(com.gestionPeliculas.DTOs.LoginDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas"));

        // Verificar contraseña usando BCrypt
        if (!passwordEncoder.matches(dto.getPassword(), usuario.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas");
        }

        // Verificar si el usuario está activo
        if (Boolean.FALSE.equals(usuario.getActivo())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "Tu cuenta ha sido desactivada. Contacta al administrador.");
        }

        return usuarioMapper.toDto(usuario);
    }

    @Transactional
    public UsuarioDTO cambiarEstado(Long id, Boolean activo) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        usuario.setActivo(activo);
        usuario = usuarioRepository.save(usuario);
        return usuarioMapper.toDto(usuario);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));

        System.out.println("Loading user: " + email);
        System.out.println("Role: " + usuario.getRol());
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name());
        System.out.println("Authority: " + authority.getAuthority());

        return new org.springframework.security.core.userdetails.User(
                usuario.getEmail(),
                usuario.getPassword(),
                Collections.singletonList(authority));
    }
}
