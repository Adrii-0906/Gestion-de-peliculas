package com.gestionPeliculas.service;

import com.gestionPeliculas.DTOs.PeliculaCreateUpdateDTO;
import com.gestionPeliculas.DTOs.PeliculaDTO;
import com.gestionPeliculas.DTOs.mappers.PeliculaMapper;
import com.gestionPeliculas.domain.Actor;
import com.gestionPeliculas.domain.Director;
import com.gestionPeliculas.domain.Pelicula;
import com.gestionPeliculas.repository.ActorRepository;
import com.gestionPeliculas.repository.DirectorRepository;
import com.gestionPeliculas.repository.PeliculaRepository;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Random;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Semaphore;
import java.util.stream.Stream;

@Service
@Getter
public class PeliculaService {

    @Autowired
    private AsyncService asyncService;

    @Autowired
    private PeliculaRepository peliculaRepository;
    @Autowired
    private DirectorRepository directorRepository;
    @Autowired
    private ActorRepository actorRepository;

    @Autowired
    private PeliculaMapper mapper;

    @Autowired
    @Lazy
    private PeliculaService self;


    // --- MÉTODOS PRINCIPALES ---

    @Transactional(readOnly = true)
    public List<PeliculaDTO> listar() {
        return peliculaRepository.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public PeliculaDTO buscarPorId(Long id) {
        Pelicula p = peliculaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Película no encontrada con id: " + id));
        return mapper.toDto(p);
    }

    @Transactional
    public PeliculaDTO agregar(PeliculaCreateUpdateDTO dto) {
        // 1. Convertimos los datos básicos
        Pelicula pelicula = mapper.toEntity(dto);

        // 2. Buscamos o Creamos las relaciones (Director y Actores)
        asignarRelacionesPorNombre(pelicula, dto);

        // 3. Guardamos
        Pelicula guardada = peliculaRepository.save(pelicula);
        return mapper.toDto(guardada);
    }

    @Transactional
    public PeliculaDTO actualizar(Long id, PeliculaCreateUpdateDTO dto) {
        Pelicula peliculaExistente = peliculaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Película no encontrada con id: " + id));

        // 1. Actualizamos campos básicos
        mapper.updateEntity(dto, peliculaExistente);

        // 2. Actualizamos relaciones
        asignarRelacionesPorNombre(peliculaExistente, dto);

        // 3. Guardamos
        Pelicula actualizada = peliculaRepository.save(peliculaExistente);
        return mapper.toDto(actualizada);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!peliculaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Película no encontrada con id: " + id);
        }
        peliculaRepository.deleteById(id);
    }


    // --- LÓGICA MÁGICA: BUSCAR O CREAR POR NOMBRE ---

    private void asignarRelacionesPorNombre(Pelicula pelicula, PeliculaCreateUpdateDTO dto) {

        // 1. GESTIÓN DEL DIRECTOR
        if (dto.getNombreDirector() != null && !dto.getNombreDirector().isBlank()) {
            String nombreLimpio = dto.getNombreDirector().trim();

            // Buscamos si ya existe ese director
            Director director = directorRepository.findByNombre(nombreLimpio)
                    .orElseGet(() -> {
                        // Si NO existe, lo creamos nuevo al vuelo
                        Director nuevo = new Director();
                        nuevo.setNombre(nombreLimpio);
                        return directorRepository.save(nuevo);
                    });

            pelicula.setDirector(director);
        }

        // 2. GESTIÓN DE ACTORES
        if (dto.getNombresActores() != null && !dto.getNombresActores().isEmpty()) {
            List<Actor> listaActores = new ArrayList<>();

            for (String nombreActor : dto.getNombresActores()) {
                if (nombreActor == null || nombreActor.isBlank()) continue;

                String nombreLimpio = nombreActor.trim();

                // Buscamos si ya existe el actor
                Actor actor = actorRepository.findByNombre(nombreLimpio)
                        .orElseGet(() -> {
                            // Si NO existe, lo creamos nuevo
                            Actor nuevo = new Actor();
                            nuevo.setNombre(nombreLimpio);
                            return actorRepository.save(nuevo);
                        });

                listaActores.add(actor);
            }
            pelicula.setActores(listaActores);
        }
    }


    // --- TUS MÉTODOS ASÍNCRONOS Y DE EJERCICIOS ANTERIORES (INTACTOS) ---

    public String tareaLenta(String titulo) {
        try {
            System.out.println("Iniciando tarea para " + titulo + " en " + Thread.currentThread().getName());
            Thread.sleep(3000);
            System.out.println("Terminando tarea para " + titulo);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return "Procesada " + titulo;
    }

    @Async("taskExecutor")
    public CompletableFuture<String> tareaLenta2(String titulo) {
        try {
            System.out.println("Iniciando " + titulo + " en " + Thread.currentThread().getName());
            Thread.sleep(3000);
            System.out.println("Terminando " + titulo);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return CompletableFuture.completedFuture("Procesada " + titulo);
    }

    @Async("taskExecutor")
    public CompletableFuture<String> reproducir(String titulo) {
        try {
            long inicio = System.currentTimeMillis();
            System.out.println("Reproduciendo " + titulo + " en " + Thread.currentThread().getName());
            int milisegundos = (new Random().nextInt(5) + 1) * 1000;
            Thread.sleep(milisegundos);
            System.out.println("Procesada la película: " + titulo + " en " + (System.currentTimeMillis() - inicio) + " ms");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return CompletableFuture.completedFuture("Procesada " + titulo);
    }

    public void importarCarpeta(String rutaCarpeta) throws IOException {
        long inicio = System.currentTimeMillis();
        List<CompletableFuture<Void>> futures = new ArrayList<>();
        try (Stream<Path> paths = Files.list(Paths.get(rutaCarpeta))) {
            paths.filter(Files::isRegularFile).forEach(path -> {
                String nombre = path.toString().toLowerCase();
                if (nombre.endsWith(".csv") || nombre.endsWith(".txt")) {
                    futures.add(asyncService.importarCsvAsync(path));
                } else if (nombre.endsWith(".xml")) {
                    futures.add(asyncService.importarXmlAsync(path));
                }
            });
        }
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        System.out.println("Importación completa en " + (System.currentTimeMillis() - inicio) + " ms");
    }

    public HashMap<String, Integer> votacionOscars(int jurados) {
        ConcurrentHashMap<String, Integer> votacion = new ConcurrentHashMap<>();
        Semaphore sem = new Semaphore(5);
        long inicio = System.currentTimeMillis();

        List<Pelicula> peliculas = peliculaRepository.findAll();
        for (Pelicula p : peliculas) {
            votacion.put(p.getTitulo(), 0);
        }

        List<CompletableFuture<Void>> tareas = new ArrayList<>();
        for (int i = 0; i < jurados; i++) {
            tareas.add(asyncService.votar(peliculas, i + 1, sem, votacion));
        }

        CompletableFuture.allOf(tareas.toArray(new CompletableFuture[0])).join();

        System.out.println("Votaciones finalizadas.");
        System.out.println("Resultado: " + votacion);
        System.out.println("Duración: " + (System.currentTimeMillis() - inicio) + " ms");

        return new HashMap<>(votacion);
    }
}